import {
  createParser,
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const parseAsPositiveInteger = createParser({
  parse: (v) => {
    const int = parseInt(v);
    if (Number.isNaN(int)) {
      return null;
    }
    if (int < 0) {
      return null;
    }
    return int;
  },
  serialize: (v) => Math.round(v).toFixed(),
});

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault("createdAt"),
  sortValue: parseAsString.withDefault("desc"),
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const paginationParser = {
  page: parseAsPositiveInteger.withDefault(0),
  size: parseAsInteger.withDefault(5),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  ...sortParser,
  ...paginationParser,
});

export type ParsedSearchParams = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
