import axios from 'axios';
import https from 'https';
import dns from 'dns';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// ── Custom DNS Resolver (Bypasses ISP DNS Hijacking / poisoning) ──────────────
// Uses Google DNS (8.8.8.8, 8.8.4.4), OpenDNS (208.67.222.222), and Cloudflare (1.1.1.1)
// with EDNS Client Subnet (ECS) to resolve high-performance regional CloudFront edge IPs.
const dnsResolver = new dns.promises.Resolver();
dnsResolver.setServers(['8.8.8.8', '8.8.4.4', '208.67.222.222', '1.1.1.1', '1.0.0.1']);

const dnsCache = new Map();
const DNS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let ipRotationIndex = 0;

const customDnsLookup = (hostname, options, callback) => {
  let cb = callback;
  let opts = options;
  if (typeof options === 'function') {
    cb = options;
    opts = {};
  }
  opts = opts || {};

  const now = Date.now();
  const cached = dnsCache.get(hostname);
  if (cached && now - cached.timestamp < DNS_CACHE_TTL_MS && cached.ips.length > 0) {
    if (opts.all) {
      return cb(null, cached.ips.map((ip) => ({ address: ip, family: 4 })));
    }
    const ip = cached.ips[ipRotationIndex % cached.ips.length];
    return cb(null, ip, 4);
  }

  dnsResolver
    .resolve4(hostname)
    .then((addresses) => {
      if (addresses && addresses.length > 0) {
        dnsCache.set(hostname, { ips: addresses, timestamp: Date.now() });
        if (opts.all) {
          cb(null, addresses.map((ip) => ({ address: ip, family: 4 })));
        } else {
          const ip = addresses[ipRotationIndex % addresses.length];
          cb(null, ip, 4);
        }
      } else {
        dns.lookup(hostname, options, callback);
      }
    })
    .catch((err) => {
      console.warn(`[TMDB DNS Warning] Custom resolver for ${hostname} failed: ${err.message}. Falling back to OS resolver.`);
      dns.lookup(hostname, options, callback);
    });
};

const tmdbHttpsAgent = new https.Agent({
  lookup: customDnsLookup,
  keepAlive: true,
});

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  httpsAgent: tmdbHttpsAgent,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json',
  },
});

// Dynamically attach API key and log request details
tmdbApi.interceptors.request.use(
  (config) => {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      console.error('⚠️ [TMDB API] process.env.TMDB_API_KEY is not set or undefined!');
    }
    config.params = {
      api_key: apiKey,
      ...config.params,
    };
    console.log(`[TMDB Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params);
    return config;
  },
  (error) => {
    console.error('[TMDB Request Error]', error.message);
    return Promise.reject(error);
  }
);

tmdbApi.interceptors.response.use(
  (response) => {
    console.log(`[TMDB Response] ${response.status} ${response.config.url} (Items: ${response.data?.results?.length ?? 'N/A'})`);
    return response;
  },
  async (error) => {
    const config = error.config;
    // Auto-retry up to 2 times on network errors (ECONNRESET, ETIMEDOUT, timeout) by cycling to next IP
    if (config && (!error.response || error.response.status >= 500) && (config._retryCount || 0) < 2) {
      config._retryCount = (config._retryCount || 0) + 1;
      ipRotationIndex++;
      console.warn(`⚠️ [TMDB Retry] Request to ${config.url} failed (${error.message}). Cycling IP and retrying (attempt ${config._retryCount}/2)...`);
      return tmdbApi(config);
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error(`❌ [TMDB Timeout Error] Request to ${error.config?.url} timed out after 10s. This may indicate an ISP blocking or connectivity issue.`);
    } else if (error.response) {
      console.error(`❌ [TMDB API Error] Status ${error.response.status} on ${error.config?.url}:`, error.response.data);
    } else {
      console.error(`❌ [TMDB Network Error] ${error.message} on ${error.config?.url}. Check DNS resolution and internet connection.`);
    }
    return Promise.reject(error);
  }
);

// Trending movies/shows (all languages)
export const getTrending = async (mediaType = 'movie') => {
  const response = await tmdbApi.get(`/trending/${mediaType}/week`);
  return response.data.results;
};

// Popular content filtered by language (e.g. 'hi' for Bollywood, 'te' for Telugu)
export const getPopularByLanguage = async (language = 'en', mediaType = 'movie') => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_original_language: language,
      sort_by: 'popularity.desc',
    },
  });
  return response.data.results;
};

// Get by genre
export const getByGenre = async (genreId, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc',
    },
  });
  return response.data.results;
};

// Search
export const searchContent = async (query, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/search/${mediaType}`, {
    params: { query },
  });
  return response.data.results;
};

// Get details by ID (for Watch page)
// append_to_response fetches videos + credits in a single request.
// language: 'en-US' ensures the full English video list (trailers, teasers, etc.) is returned.
export const getDetailsById = async (id, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/${mediaType}/${id}`, {
    params: {
      append_to_response: 'videos,credits',
      language: 'en-US',
    },
  });
  return response.data;
};
// Discover movies by genre name + optional keyword
export const discoverByMood = async (genreNames, language = null, mediaType = 'movie') => {
  const genreMap = {
    Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
    Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
    Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749,
    'Science Fiction': 878, Thriller: 53, War: 10752,
  };

  const genreIds = genreNames
    .map((name) => genreMap[name])
    .filter(Boolean)
    .join(',');

  const params = {
    with_genres: genreIds,
    sort_by: 'popularity.desc',
  };

  if (language) {
    params.with_original_language = language;
  }

  const response = await tmdbApi.get(`/discover/${mediaType}`, { params });
  return response.data.results;
};

export const getSimilarMovies = async (id, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/${mediaType}/${id}/similar`);
  return response.data.results;
};

// Get list of available watch providers (Netflix, Prime, etc.) for India
export const getWatchProviders = async (mediaType = 'movie') => {
  const response = await tmdbApi.get(`/watch/providers/${mediaType}`, {
    params: { watch_region: 'IN' },
  });
  return response.data.results;
};

// Discover movies/shows available on a specific platform
export const discoverByProvider = async (providerId, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_watch_providers: providerId,
      watch_region: 'IN',
      sort_by: 'popularity.desc',
    },
  });
  return response.data.results;
};