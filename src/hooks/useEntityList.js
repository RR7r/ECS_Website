const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

function toItems(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

/**
 * Fetch a list of records from an entity, sorted and limited.
 * Returns { data, loading, error }.
 */
export function useEntityList(entityName, { sort, limit = 100, filter, deps = [] } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const entity = db.entities[entityName];
    if (!entity) {
      setLoading(false);
      setError(new Error(`Entity ${entityName} not found`));
      return;
    }
    entity
      .filter(filter || {}, { sort, limit })
      .then((res) => {
        if (!active) return;
        setData(toItems(res));
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setData([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.length ? deps : [entityName, sort, limit, JSON.stringify(filter || {})]);

  return { data, loading, error };
}

export function useEntityBySlug(entityName, slug, { onlyPublished = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const entity = db.entities[entityName];
    if (!entity || !slug) {
      setLoading(false);
      return;
    }
    const query = { slug };
    if (onlyPublished) query.published = true;
    entity
      .filter(query, { limit: 1 })
      .then((res) => {
        if (!active) return;
        setData(toItems(res)[0] || null);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [entityName, slug, onlyPublished]);

  return { data, loading, error };
}