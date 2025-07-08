import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../App.css";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import SearchBar from "./multipurpose/SearchBar.jsx";
import SearchResult from "./multipurpose/SearchResult.jsx";
import axios from "axios"; // Ensure axios is installed

function SearchFilter({ filterValue, isActive, onClick }) {
  return (
    <button
      className={`searchFilter ${
        isActive ? "bg-secondary text-primary" : "bg-primary text-secondary"
      }`}
      onClick={() => onClick(filterValue)}
    >
      {filterValue}
    </button>
  );
}

function SearchFilterBar({ activeFilter, setActiveFilter }) {
  return (
    <div className="searchFilterBar w-350 md:w-96">
      <SearchFilter
        filterValue="all"
        isActive={activeFilter === "all"}
        onClick={setActiveFilter}
      />
      <SearchFilter
        filterValue="users"
        isActive={activeFilter === "users"}
        onClick={setActiveFilter}
      />
      <SearchFilter
        filterValue="recipes"
        isActive={activeFilter === "recipes"}
        onClick={setActiveFilter}
      />
    </div>
  );
}

function SearchView() {
  const location = useLocation();
  const { user, getToken } = useAuth();
  const currentUserId = user?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API URL configuration
  const API_URL =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api";

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${API_URL}/engagement/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && typeof response.data === "object") {
        let results = [];

        // Handle case where response.data itself is the array
        if (Array.isArray(response.data)) {
          results = response.data;
          console.log("Using response.data as array:", results.length, "items");
        }
        // Handle case where response.data.all exists
        else if (Array.isArray(response.data.all)) {
          results = response.data.all;
          console.log("Using response.data.all:", results.length, "items");
        }
        // Handle case where response contains userResults and recipeResults
        else if (response.data.userResults || response.data.recipeResults) {
          const users = Array.isArray(response.data.userResults)
            ? response.data.userResults.map((user) => ({
                ...user,
                type: "user",
              }))
            : [];
          const recipes = Array.isArray(response.data.recipeResults)
            ? response.data.recipeResults.map((recipe) => ({
                ...recipe,
                type: "recipe",
              }))
            : [];
          results = [...users, ...recipes];
          console.log(
            "Combined users and recipes:",
            users.length,
            "users +",
            recipes.length,
            "recipes =",
            results.length,
            "total items"
          );
        }
        // Handle case where response contains users and recipes (original expected format)
        else if (response.data.users || response.data.recipes) {
          const users = Array.isArray(response.data.users)
            ? response.data.users.map((user) => ({ ...user, type: "user" }))
            : [];
          const recipes = Array.isArray(response.data.recipes)
            ? response.data.recipes.map((recipe) => ({
                ...recipe,
                type: "recipe",
              }))
            : [];
          results = [...users, ...recipes];
          console.log(
            "Combined users and recipes (original format):",
            users.length,
            "users +",
            recipes.length,
            "recipes =",
            results.length,
            "total items"
          );
        }

        // Log all results to help debug
        console.log("Processed search results:", results);

        // Ensure each result has the correct ID properties
        const normalizedResults = results.map((result) => {
          // Make a copy to avoid modifying the original
          const normalizedResult = { ...result };

          if (normalizedResult.type === "user") {
            // Ensure userId is set correctly based on various possible ID fields
            normalizedResult.userId =
              normalizedResult.userId ||
              normalizedResult.user_auth_id ||
              normalizedResult.id;

            console.log(
              `User result: id=${normalizedResult.id}, userId=${normalizedResult.userId}, username=${normalizedResult.username}`
            );
          } else if (normalizedResult.type === "recipe") {
            // Ensure recipeId is set correctly
            normalizedResult.recipeId =
              normalizedResult.recipeId || normalizedResult.id;

            console.log(
              `Recipe result: id=${normalizedResult.id}, recipeId=${normalizedResult.recipeId}, title=${normalizedResult.title}`
            );
          }

          return normalizedResult;
        });

        // Store normalized results
        setAllSearchResults(normalizedResults);

        // Initial filtering based on current activeFilter
        filterResults(normalizedResults, activeFilter);
      } else {
        console.error("Unexpected API response format:", response.data);
        setError("Received unexpected data format from server");
        setAllSearchResults([]);
        setFilteredResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("An error occurred while searching. Please try again.");
      setAllSearchResults([]);
      setFilteredResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = (results, filter) => {
    if (!Array.isArray(results)) {
      console.error("Expected array for filtering, got:", results);
      setFilteredResults([]);
      return;
    }

    if (filter === "all") {
      setFilteredResults(results);
    } else if (filter === "users") {
      setFilteredResults(results.filter((result) => result.type === "user"));
    } else if (filter === "recipes") {
      setFilteredResults(results.filter((result) => result.type === "recipe"));
    }
  };

  useEffect(() => {
    // Apply filtering when the active filter changes
    if (Array.isArray(allSearchResults)) {
      filterResults(allSearchResults, activeFilter);
    }
  }, [activeFilter, allSearchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div>
      <HeaderFooter>
        <div className="mt-20 mb-16">
          <div className="flex flex-col w-full items-center gap-4">
            <form onSubmit={handleSearch}>
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <SearchFilterBar
              activeFilter={activeFilter}
              setActiveFilter={handleFilterChange}
            />

            {isLoading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="flex flex-col gap-2 md:gap-4">
              {filteredResults && filteredResults.length > 0
                ? filteredResults.map((result, index) => (
                    <SearchResult
                      key={`${result.type}-${
                        result.userId || result.recipeId || index
                      }`}
                      currentUserId={currentUserId}
                      searchReturnValue={
                        result.type === "user" ? result.username : result.title
                      }
                      imageUrl={
                        result.type === "user"
                          ? result.photo
                          : result.images?.[0]
                      }
                      type={result.type}
                      userId={result.type === "user" ? result.userId : null}
                      recipeId={
                        result.type === "recipe" ? result.recipeId : null
                      }
                    />
                  ))
                : !isLoading && <p></p>}
            </div>
          </div>
        </div>
      </HeaderFooter>
    </div>
  );
}

export default SearchView;
