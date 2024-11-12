import React, { useEffect, useState } from 'react';
import './App.css';
import { ImagesComponent } from './components/ten-image-component';

interface IDepartment {
  departmentId: number;
  displayName: string;
}

function App() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [depoid, setDepoid] = useState<number | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchParams, setSearchParams] = useState<{ departamentsid: number | undefined; inputValue: string }>({
    departamentsid: undefined,
    inputValue: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/all');
        const result = await response.json();
        console.log('Fetched departments:', result.data.departments);
        if (response.ok && Array.isArray(result.data.departments)) {
          setDepartments(result.data.departments);
        } else {
          setError(result.message || 'Failed to load departments');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while fetching departments');
      }
    };
  
    fetchData();
  }, []);
  

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDepoid(Number(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    setSearchParams({ departamentsid: depoid, inputValue });
  };

  return (
    <div id="root">
      <header>
        <h1>Metropolitan Museum</h1>
      </header>

      <div className="logo-container">
        <a href="https://www.metmuseum.org/" target="_blank" rel="noopener noreferrer">
          <img src="logo.jpg" alt="Metropolitan Museum Logo" className="logo" />
        </a>
      </div>
      <main>
        <p>Welcome to the Metropolitan Museum Collection!</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={(e) => e.preventDefault()}>
          <select name="Departments" onChange={handleDepartmentChange} value={depoid ?? ''}>
            <option value="" disabled>Select a Department</option>
            {departments.map((department) => (
              <option key={department.departmentId} value={department.departmentId}>
                {department.displayName}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="search"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter artwork title"
          />
          <button type="button" onClick={handleSearch}>Search</button>
        </form>

        <ImagesComponent departmentId={searchParams.departamentsid} searchQuery={searchParams.inputValue} />
      </main>

      <footer>
        <p>&copy; 2024 Metropolitan Museum. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
