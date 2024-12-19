import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";

// Constants
const API_URL = "https://data.gov.il/api/3/action/datastore_search";
const CITIES_RESOURCE_ID = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const STREETS_RESOURCE_ID = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const CITY_NAME_KEY = "שם_ישוב";
const STREET_NAME_KEY = "שם_רחוב";

const IsraeliAddressSelector = () => {
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Fetch coordinates using OpenStreetMap Nominatim
  const fetchCoordinates = async (city, street) => {
    if (!city || !street) return null;

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${street}, ${city}, Israel`,
            format: "json",
            limit: 1,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch coordinates", error);
      return null;
    }
  };

  // Existing city and street fetching logic remains the same...
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            resource_id: CITIES_RESOURCE_ID,
            limit: 32000,
          },
        });

        const cityNames = response.data.result.records
          .map((city) => city[CITY_NAME_KEY].trim())
          .sort();

        setCities(cityNames);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchStreets = async () => {
      if (!selectedCity) {
        setStreets([]);
        return;
      }

      try {
        const queryParam = JSON.stringify({
          [CITY_NAME_KEY]: selectedCity,
        });

        const response = await axios.get(API_URL, {
          params: {
            resource_id: STREETS_RESOURCE_ID,
            q: queryParam,
            limit: 32000,
          },
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(
                ([key, value]) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
              )
              .join("&");
          },
        });

        const streetNames = response.data.result.records
          .map((street) => street[STREET_NAME_KEY].trim())
          .sort();

        setStreets(streetNames);
      } catch (error) {
        console.error("Failed to fetch streets", error);
      }
    };

    fetchStreets();
  }, [selectedCity]);

  // Fetch coordinates when city and street are selected
  useEffect(() => {
    const getCoordinates = async () => {
      if (selectedCity && selectedStreet) {
        const coords = await fetchCoordinates(selectedCity, selectedStreet);
        setCoordinates(coords);
      }
    };

    getCoordinates();
  }, [selectedCity, selectedStreet]);

  return (
    <form>
      <div style={{ marginBottom: 16 }}>
        <Autocomplete
          options={cities}
          value={selectedCity}
          onChange={(_, newValue) => {
            setSelectedCity(newValue);
            setSelectedStreet(null);
            setCoordinates(null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="בחר עיר"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Autocomplete
          options={streets}
          value={selectedStreet}
          onChange={(_, newValue) => setSelectedStreet(newValue)}
          disabled={!selectedCity}
          renderInput={(params) => (
            <TextField
              {...params}
              label="בחר רחוב"
              variant="outlined"
              fullWidth
              disabled={!selectedCity}
            />
          )}
        />
      </div>

      {coordinates && (
        <div>
          <TextField
            label="קואורדינטות"
            value={`Latitude: ${coordinates[0]}, Longitude: ${coordinates[1]}`}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      )}
    </form>
  );
};

export default IsraeliAddressSelector;
