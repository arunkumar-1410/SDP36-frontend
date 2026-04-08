import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const HealthContext = createContext(undefined);

export const HealthProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resResponse, progResponse] = await Promise.all([
        apiClient.get('/api/resources'),
        apiClient.get('/api/programs')
      ]);
      setResources(resResponse.data);
      setPrograms(progResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addResource = async (resource) => {
    const res = await apiClient.post('/api/resources', resource);
    setResources([...resources, res.data]);
  };

  const updateResource = async (id, updates) => {
    const res = await apiClient.put(`/api/resources/${id}`, updates);
    setResources(resources.map(r => r.id === id ? res.data : r));
  };

  const deleteResource = async (id) => {
    await apiClient.delete(`/api/resources/${id}`);
    setResources(resources.filter(r => r.id !== id));
  };

  const addProgram = async (program) => {
    const res = await apiClient.post('/api/programs', program);
    setPrograms([...programs, res.data]);
  };

  const updateProgram = async (id, updates) => {
    const res = await apiClient.put(`/api/programs/${id}`, updates);
    setPrograms(programs.map(p => p.id === id ? res.data : p));
  };

  const deleteProgram = async (id) => {
    await apiClient.delete(`/api/programs/${id}`);
    setPrograms(programs.filter(p => p.id !== id));
  };

  const enrollInProgram = async (programId) => {
    try {
      await apiClient.post(`/api/user/enroll/${programId}`);
      // No need to return anything, just success
    } catch (error) {
      throw error;
    }
  };

  const logResourceAccess = async (resourceId) => {
    try {
      await apiClient.post(`/api/user/resource-access/${resourceId}`);
    } catch (error) {
      console.error('Failed to log access', error);
    }
  };

  return (
    <HealthContext.Provider
      value={{
        resources,
        programs,
        loading,
        enrollments,
        addResource,
        updateResource,
        deleteResource,
        addProgram,
        updateProgram,
        deleteProgram,
        enrollInProgram,
        logResourceAccess,
        fetchData
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within HealthProvider');
  }
  return context;
};
