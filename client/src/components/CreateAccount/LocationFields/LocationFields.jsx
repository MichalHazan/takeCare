import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity, setStreet, setHouseNumber, setCoordinates } from './locationSlice';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Autocomplete, Box, FormControl, InputLabel, TextField } from '@mui/material';
import '../CreateAccountForm.css';

const LocationFields = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { city, street, houseNumber, coordinates } = useSelector((state) => state.location);

    const [citiesName, setCitiesName] = useState([]);
    const [streets, setStreets] = useState([]);
    const [loadingCitys, setLoadingCitys] = useState(false);
    const [loadingStreets, setLoadingStreets] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCities = async () => {
            setLoadingCitys(true);
            setError(null);

            const query = `
                [out:json];
                area["name:en"~"^(Israel|Judea and Samaria)$"]->.searchArea;
                node["place"~"^(city|town)$"](area.searchArea); 
                out body;
            `;
            try {
                const response = await axios.post(
                    'https://overpass-api.de/api/interpreter',
                    query,
                    { headers: { 'Content-Type': 'text/plain' } }
                );
                const data = response.data.elements;
                const cityListNames = data
                    .map((city) => city.tags.name)
                    .filter((city) => city)
                    .sort((a, b) => a.localeCompare(b));

                    const uniqueCityListNames = Array.from(new Set(cityListNames));
                setCitiesName(uniqueCityListNames);
            } catch (err) {
                setError('Failed to fetch cities. Please try again.');
            } finally {
                setLoadingCitys(false);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const fetchStreets = async () => {
            if (!city) return;

            setLoadingStreets(true);
            setError(null);

            const query = `
                [out:json];
                area["name"="${city}"]->.searchArea;
                way["highway"](area.searchArea);
                out body;
                >;
                out skel qt;
            `;
            try {
                const response = await axios.post(
                    'https://overpass-api.de/api/interpreter',
                    query,
                    { headers: { 'Content-Type': 'text/plain' } }
                );
                const data = response.data.elements;
                const streetNames = data
                    .filter((item) => item.tags && item.tags.name)
                    .map((item) => item.tags.name)
                    .filter((street) => street)
                    .sort((a, b) => a.localeCompare(b));
                const uniqueStreetNames = Array.from(new Set(streetNames));

                setStreets(uniqueStreetNames);
            } catch (err) {
                setError('Failed to fetch streets. Please try again.');
            } finally {
                setLoadingStreets(false);
            }
        };

        fetchStreets();
    }, [city]);

    useEffect(() => {
        const fetchGeocode = async () => {
            if (!city || !street || !houseNumber) return;

            const fullAddress = `${city}, ${street}, ${houseNumber}`;
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: fullAddress,
                        format: 'json',
                        addressdetails: 1,
                        limit: 1,
                    },
                });
                const geocodeResult = response.data[0];
                const location = {
                    type: 'Point',
                    coordinates: [geocodeResult.lon, geocodeResult.lat],
                };
                console.log('location',location)
                dispatch(setCoordinates(location));
            } catch (err) {
                console.error('Failed to fetch geocode:', err);
            }
        };

        fetchGeocode();
    }, [city, street, houseNumber, dispatch]);

    return (
        <Box>
            <FormControl fullWidth className="form-input">
                {loadingCitys && <span>{t('Loading cities')}</span>}
                <InputLabel>{!city && t('City')}</InputLabel>
                <Autocomplete
                    options={citiesName}
                    value={city}
                    onChange={(_, newValue) => {
                        dispatch(setCity(newValue));
                        dispatch(setStreet(''));
                        dispatch(setHouseNumber(''));
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label={t('City')} variant="outlined" fullWidth />
                    )}
                />
            </FormControl>

            <FormControl fullWidth className="form-input">
                {loadingStreets && <span>{t('Loading streets')}</span>}
                <InputLabel>{!street && t('Street')}</InputLabel>
                <Autocomplete
                    options={streets}
                    value={street}
                    onChange={(_, newValue) => dispatch(setStreet(newValue))}
                    disabled={!city}
                    renderInput={(params) => (
                        <TextField {...params} label={t('Street')} variant="outlined" fullWidth />
                    )}
                />
            </FormControl>

            <TextField
                fullWidth
                label={t('House number')}
                value={houseNumber}
                type="number"
                variant="outlined"
                className="form-small-input"
                onChange={(e) => dispatch(setHouseNumber(e.target.value))}
                required
                disabled={!street}
            />
        </Box>
    );
};

export default LocationFields;
