import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearch } from "../contexts/SearchContext";

export function useMovies({ endpoint, perPage = 24, params = {} }) {
  const { search } = useSearch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async (p = 1) => {
    setLoading(true);

    try {
      const res = await api.get(endpoint, {
        params: {
          page: p,
          per_page: perPage,
          search,
          ...params,
        },
      });

      const result = res.data.data;

      setData(result.data);
      setPage(result.current_page);
      setLastPage(result.last_page);
    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchData(page);
  }, [page, search]);

  return {
    data,
    loading,
    page,
    setPage,
    lastPage,
  };
}