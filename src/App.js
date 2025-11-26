import React, { useState } from 'react';
import { Calendar, Thermometer, Sprout } from 'lucide-react';

function App() {
  const [zipCode, setZipCode] = useState('77478');
  const [targetDate, setTargetDate] = useState('');
  const [result, setResult] = useState(null);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [bedLength, setBedLength] = useState(6);
  const [bedWidth, setBedWidth] = useState(3);
  const [showLayout, setShowLayout] = useState(false);
  const [generatedLayout, setGeneratedLayout] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const plantDatabase = [
    { name: 'Alyssum', daysToMaturity: 70, tempLower: 60, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Alyssum (Fall)', daysToMaturity: 70, tempLower: 60, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Amaranth', daysToMaturity: 90, tempLower: 65, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Artichoke', daysToMaturity: 160, tempLower: 60, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XXL', spacing: 18, category: 'Vegetable' },
    { name: 'Asparagus', daysToMaturity: 700, tempLower: 65, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Vegetable' },
    { name: 'Basil', daysToMaturity: 60, tempLower: 70, tempUpper: 85, tolerance: 'flexible', maxWeeksOutside: 4, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Bee Balm', daysToMaturity: 115, tempLower: 60, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Beets (Fall)', daysToMaturity: 55, tempLower: 50, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XS', spacing: 1.5, category: 'Vegetable' },
    { name: 'Beets (Spring)', daysToMaturity: 55, tempLower: 50, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XS', spacing: 1.5, category: 'Vegetable' },
    { name: 'Black Eyed Susan', daysToMaturity: 120, tempLower: 65, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Black Knight Runner Bean', daysToMaturity: 80, tempLower: 60, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Vegetable' },
    { name: 'Blue Lake 274 Bean (fall)', daysToMaturity: 58, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Blue Lake 274 Bean (spring)', daysToMaturity: 58, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Bok Choy (Fall)', daysToMaturity: 50, tempLower: 60, tempUpper: 80, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Vegetable' },
    { name: 'Bok Choy (Spring)', daysToMaturity: 50, tempLower: 60, tempUpper: 80, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Vegetable' },
    { name: 'Broccoli', daysToMaturity: 55, tempLower: 50, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Calendula (Fall)', daysToMaturity: 80, tempLower: 68, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Flower' },
    { name: 'Calendula (Spring)', daysToMaturity: 80, tempLower: 68, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Flower' },
    { name: 'Carrot (Fall)', daysToMaturity: 75, tempLower: 50, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XS', spacing: 1.5, category: 'Vegetable' },
    { name: 'Carrot (Spring)', daysToMaturity: 75, tempLower: 50, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XS', spacing: 1.5, category: 'Vegetable' },
    { name: 'Cauliflower (Fall)', daysToMaturity: 70, tempLower: 50, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Cauliflower (Spring)', daysToMaturity: 70, tempLower: 50, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Celery', daysToMaturity: 120, tempLower: 70, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Celosia', daysToMaturity: 21, tempLower: 65, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Flower' },
    { name: 'Chamomile', daysToMaturity: 90, tempLower: 68, tempUpper: 85, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Cilantro', daysToMaturity: 45, tempLower: 60, tempUpper: 80, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Contender Bean (fall)', daysToMaturity: 50, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Contender Bean (spring)', daysToMaturity: 50, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Corn', daysToMaturity: 75, tempLower: 75, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Vegetable' },
    { name: 'Cosmos', daysToMaturity: 90, tempLower: 70, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Cucumber (Fall)', daysToMaturity: 55, tempLower: 70, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Cucumber (Spring)', daysToMaturity: 70, tempLower: 70, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Daffodils', daysToMaturity: 105, tempLower: 50, tempUpper: 70, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Flower' },
    { name: 'Dill', daysToMaturity: 100, tempLower: 55, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Echinacea', daysToMaturity: 120, tempLower: 65, tempUpper: 70, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Eggplant', daysToMaturity: 90, tempLower: 75, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'L', spacing: 9, category: 'Vegetable' },
    { name: 'Gomphrena', daysToMaturity: 70, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Green Cauliflower', daysToMaturity: 70, tempLower: 50, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'XL', spacing: 9, category: 'Vegetable' },
    { name: 'Hyssop', daysToMaturity: 85, tempLower: 70, tempUpper: 80, tolerance: 'flexible', maxWeeksOutside: 4, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Kale (Fall)', daysToMaturity: 55, tempLower: 65, tempUpper: 85, tolerance: 'flexible', maxWeeksOutside: 4, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Kale (Spring)', daysToMaturity: 55, tempLower: 65, tempUpper: 85, tolerance: 'flexible', maxWeeksOutside: 4, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Lavender', daysToMaturity: 200, tempLower: 70, tempUpper: 75, tolerance: 'flexible', maxWeeksOutside: 4, size: 'L', spacing: 6, category: 'Herb', perennial: true },
    { name: 'Lemon Balm', daysToMaturity: 70, tempLower: 68, tempUpper: 70, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Herb', perennial: true, separate: true },
    { name: 'Lettuce', daysToMaturity: 55, tempLower: 60, tempUpper: 70, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Vegetable' },
    { name: 'Marigold', daysToMaturity: 95, tempLower: 75, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Melon', daysToMaturity: 100, tempLower: 70, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Fruit' },
    { name: 'Mint', daysToMaturity: 90, tempLower: 55, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Herb', perennial: true, separate: true },
    { name: 'Monarda (Bee Balm)', daysToMaturity: 115, tempLower: 60, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Herb' },
    { name: 'Mullein', daysToMaturity: 140, tempLower: 60, tempUpper: 70, tolerance: 'strict', maxWeeksOutside: 2, size: 'M', spacing: 4.5, category: 'Herb' },
    { name: 'Nasturtium', daysToMaturity: 90, tempLower: 60, tempUpper: 70, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Flower' },
    { name: 'Onion (Fall)', daysToMaturity: 160, tempLower: 45, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'S', spacing: 3, category: 'Vegetable' },
    { name: 'Oregano', daysToMaturity: 90, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Herb' },
    { name: 'Pansy', daysToMaturity: 84, tempLower: 62, tempUpper: 70, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Flower' },
    { name: 'Parsley', daysToMaturity: 90, tempLower: 50, tempUpper: 85, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Herb' },
    { name: 'Pumpkin', daysToMaturity: 120, tempLower: 65, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Vegetable' },
    { name: 'Purple Broccoli', daysToMaturity: 42, tempLower: 60, tempUpper: 80, tolerance: 'strict', maxWeeksOutside: 2, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Purple Cauliflower', daysToMaturity: 70, tempLower: 50, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'XL', spacing: 9, category: 'Vegetable' },
    { name: 'Radicchio (Fall)', daysToMaturity: 95, tempLower: 60, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Radicchio (Spring)', daysToMaturity: 95, tempLower: 60, tempUpper: 75, tolerance: 'strict', maxWeeksOutside: 2, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Radish', daysToMaturity: 22, tempLower: 50, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XS', spacing: 2, category: 'Vegetable' },
    { name: 'Rattlesnake Pole Beans', daysToMaturity: 110, tempLower: 70, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 6, category: 'Vegetable' },
    { name: 'Rhubarb', daysToMaturity: 60, tempLower: 75, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Romanesco Broccoli (Fall)', daysToMaturity: 90, tempLower: 60, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Romanesco Broccoli (Spring)', daysToMaturity: 90, tempLower: 60, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'L', spacing: 6, category: 'Vegetable' },
    { name: 'Rosemary', daysToMaturity: 400, tempLower: 68, tempUpper: 90, tolerance: 'flexible', maxWeeksOutside: 4, size: 'L', spacing: 6, category: 'Herb', perennial: true },
    { name: 'Short Stalk Bok Choy', daysToMaturity: 60, tempLower: 60, tempUpper: 80, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Vegetable' },
    { name: 'Spicy Peppers', daysToMaturity: 80, tempLower: 70, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Strawberry', daysToMaturity: 150, tempLower: 60, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Fruit' },
    { name: 'Sugar Peas', daysToMaturity: 65, tempLower: 45, tempUpper: 80, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Summer Squash', daysToMaturity: 55, tempLower: 70, tempUpper: 85, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Vegetable' },
    { name: 'Sweet Peppers', daysToMaturity: 70, tempLower: 70, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Swiss Chard', daysToMaturity: 60, tempLower: 50, tempUpper: 75, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Vegetable' },
    { name: 'Thyme', daysToMaturity: 90, tempLower: 60, tempUpper: 75, tolerance: 'flexible', maxWeeksOutside: 4, size: 'M', spacing: 6, perennial: true, category: 'Herb' },
    { name: 'Tomatillo', daysToMaturity: 85, tempLower: 75, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Vegetable' },
    { name: 'Tomato (Fall)', daysToMaturity: 80, tempLower: 70, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 9, category: 'Vegetable' },
    { name: 'Tomato (Spring)', daysToMaturity: 80, tempLower: 70, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 9, category: 'Vegetable' },
    { name: 'Watermelon', daysToMaturity: 80, tempLower: 70, tempUpper: 90, tolerance: 'moderate', maxWeeksOutside: 3, size: 'XL', spacing: 12, category: 'Fruit' },
    { name: 'Wild Bergamot', daysToMaturity: 365, tempLower: 40, tempUpper: 95, tolerance: 'moderate', maxWeeksOutside: 3, size: 'M', spacing: 4.5, category: 'Herb' },
    { name: 'Windsor Bean', daysToMaturity: 75, tempLower: 60, tempUpper: 70, tolerance: 'strict', maxWeeksOutside: 2, size: 'S', spacing: 3, category: 'Vegetable' }
  ];

  // Fetch weather data from Open-Meteo API
  // Uses PREVIOUS year's weather relative to target planting date
  const fetchWeatherData = async (zip, targetYear) => {
    try {
    setLoadingWeather(true);
    setWeatherError(null);
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/weather/${zip}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const data = await response.json();
    setWeatherData(data.weeklyData);
    setLoadingWeather(false);
    return data.weeklyData;
    
  } catch (error) {
    console.error('Weather API error:', error);
    setWeatherError(error.message);
    setLoadingWeather(false);
    return null;
  }

  };

  const sugarlandData = [
    { week: 1, date: '7-Jan', avg: 52.5 }, { week: 2, date: '14-Jan', avg: 45 }, { week: 3, date: '21-Jan', avg: 41 },
    { week: 4, date: '28-Jan', avg: 53.5 }, { week: 5, date: '4-Feb', avg: 61.5 }, { week: 6, date: '11-Feb', avg: 66 },
    { week: 7, date: '18-Feb', avg: 47.5 }, { week: 8, date: '26-Feb', avg: 72.5 }, { week: 9, date: '5-Mar', avg: 77 },
    { week: 10, date: '12-Mar', avg: 66.5 }, { week: 11, date: '19-Mar', avg: 57 }, { week: 12, date: '26-Mar', avg: 64 },
    { week: 13, date: '2-Apr', avg: 73.5 }, { week: 14, date: '9-Apr', avg: 76.5 }, { week: 15, date: '16-Apr', avg: 77.5 },
    { week: 16, date: '23-Apr', avg: 67 }, { week: 17, date: '30-Apr', avg: 76 }, { week: 18, date: '7-May', avg: 82 },
    { week: 19, date: '14-May', avg: 77.5 }, { week: 20, date: '21-May', avg: 85 }, { week: 21, date: '28-May', avg: 79.5 },
    { week: 22, date: '4-Jun', avg: 86.5 }, { week: 23, date: '11-Jun', avg: 82.5 }, { week: 24, date: '18-Jun', avg: 84 },
    { week: 25, date: '25-Jun', avg: 87.5 }, { week: 26, date: '2-Jul', avg: 87 }, { week: 27, date: '9-Jul', avg: 88 },
    { week: 28, date: '16-Jul', avg: 86.5 }, { week: 29, date: '23-Jul', avg: 82 }, { week: 30, date: '30-Jul', avg: 86.5 },
    { week: 31, date: '6-Aug', avg: 88 }, { week: 32, date: '13-Aug', avg: 88.5 }, { week: 33, date: '20-Aug', avg: 91 },
    { week: 34, date: '27-Aug', avg: 85 }, { week: 35, date: '3-Sep', avg: 83 }, { week: 36, date: '10-Sep', avg: 80.5 },
    { week: 37, date: '17-Sep', avg: 87 }, { week: 38, date: '24-Sep', avg: 85 }, { week: 39, date: '1-Oct', avg: 83.5 },
    { week: 40, date: '8-Oct', avg: 80 }, { week: 41, date: '15-Oct', avg: 82 }, { week: 42, date: '22-Oct', avg: 74 },
    { week: 43, date: '29-Oct', avg: 80 }, { week: 44, date: '5-Nov', avg: 73 }, { week: 45, date: '12-Nov', avg: 71.5 },
    { week: 46, date: '19-Nov', avg: 68.5 }, { week: 47, date: '26-Nov', avg: 62.5 }, { week: 48, date: '3-Dec', avg: 59.5 },
    { week: 49, date: '10-Dec', avg: 59.5 }, { week: 50, date: '17-Dec', avg: 62.5 }, { week: 51, date: '24-Dec', avg: 60.5 },
    { week: 52, date: '31-Dec', avg: 53.5 }
  ];

  const getSeason = (temp) => {
    if (temp >= 85) return 'hot';
    if (temp >= 65) return 'warm';
    if (temp >= 40) return 'cool';
    return 'cold';
  };

  const getSeasonColor = (season) => {
    const colors = {
      hot: 'bg-red-100 text-red-800 border-red-300',
      warm: 'bg-orange-100 text-orange-800 border-orange-300',
      cool: 'bg-blue-100 text-blue-800 border-blue-300',
      cold: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[season];
  };

  const getPlantSeasons = (plant) => {
    const seasons = [];
    if (plant.tempLower <= 64 && plant.tempUpper >= 40) seasons.push('cold');
    if (plant.tempLower <= 64 && plant.tempUpper >= 50) seasons.push('cool');
    if (plant.tempLower <= 84 && plant.tempUpper >= 65) seasons.push('warm');
    if (plant.tempUpper >= 70) seasons.push('hot');
    return [...new Set(seasons)];
  };

  const processWeatherData = () => {
    // Use fetched weather data if available, otherwise use hardcoded Sugarland data
    const dataToUse = weatherData || sugarlandData;
    let seasonData = dataToUse.map(week => ({ ...week, season: getSeason(week.avg) }));

    const smoothSeasons = [...seasonData];
    for (let i = 0; i < seasonData.length; i++) {
      const prev = seasonData[(i - 1 + seasonData.length) % seasonData.length];
      const current = seasonData[i];
      const next = seasonData[(i + 1) % seasonData.length];
      
      if (current.season !== prev.season && current.season !== next.season && prev.season === next.season) {
        const avgNeighborTemp = (prev.avg + next.avg) / 2;
        if (Math.abs(current.avg - avgNeighborTemp) <= 15) {
          smoothSeasons[i] = { ...current, season: prev.season };
        }
      }
    }
    seasonData = smoothSeasons;

    const transitions = [];
    for (let i = 0; i < seasonData.length; i++) {
      const current = seasonData[i];
      const next = seasonData[(i + 1) % seasonData.length];
      if (current.season !== next.season) {
        transitions.push({ transitionWeek: i + 1, fromSeason: current.season, toSeason: next.season, weekIndex: i });
      }
    }

    const mergedTransitions = [];
    let i = 0;
    while (i < transitions.length) {
      const current = transitions[i];
      let lastInSequence = current;
      let j = i + 1;
      while (j < transitions.length && transitions[j].weekIndex - lastInSequence.weekIndex <= 4) {
        lastInSequence = transitions[j];
        j++;
      }
      mergedTransitions.push(lastInSequence);
      i = j;
    }

    const plantingWindows = mergedTransitions.map(t => ({
      transitionWeek: t.transitionWeek,
      fromSeason: t.fromSeason,
      toSeason: t.toSeason,
      windowStart: (t.weekIndex >= 1 ? t.weekIndex : seasonData.length - 1),
      windowEnd: ((t.weekIndex + 3) % seasonData.length),
      weeks: []
    }));

    plantingWindows.forEach(t => {
      for (let w = t.windowStart; w <= t.windowEnd; w++) {
        t.weeks.push(seasonData[(w - 1) % seasonData.length]);
      }
    });

    return { seasonData, transitions: plantingWindows };
  };

  const canPlantMatureInWindow = (plant, plantingWindow, seasonData) => {
    const plantSeasons = getPlantSeasons(plant);
    const weeksNeeded = Math.ceil(plant.daysToMaturity / 7);
    let weeksInIdeal = 0;
    
    for (let i = 0; i < weeksNeeded && i < 52; i++) {
      const weekIndex = (plantingWindow.transitionWeek + i - 1) % seasonData.length;
      const temp = seasonData[weekIndex].avg;
      if (temp >= plant.tempLower && temp <= plant.tempUpper) weeksInIdeal++;
    }
    
    if (plant.tolerance === 'strict') return weeksInIdeal >= weeksNeeded * 0.9;
    if (plant.tolerance === 'moderate') return weeksInIdeal >= weeksNeeded * 0.7;
    return weeksInIdeal >= weeksNeeded * 0.6;
  };

  const getEligiblePlants = (plantingWindow, seasonData) => {
    return plantDatabase.filter(plant => {
      const plantSeasons = getPlantSeasons(plant);
      const { fromSeason, toSeason } = plantingWindow;
      if (!plantSeasons.includes(fromSeason) && !plantSeasons.includes(toSeason)) return false;
      return canPlantMatureInWindow(plant, plantingWindow, seasonData);
    });
  };

  const findPlantingWindow = (dateStr) => {
    const { seasonData, transitions } = processWeatherData();
    const inputDate = new Date(dateStr);
    const startOfYear = new Date(inputDate.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((inputDate - startOfYear) / (24 * 60 * 60 * 1000));
    const targetWeek = Math.ceil(dayOfYear / 7);

    for (const transition of transitions) {
      if (transition.weeks.some(w => w.week === targetWeek)) {
        return { plantingWindow: transition, targetWeekData: seasonData[targetWeek - 1], isInWindow: true };
      }
    }

    let nextTransition = transitions.find(t => t.windowStart > targetWeek) || transitions[0];
    return { plantingWindow: nextTransition, targetWeekData: seasonData[targetWeek - 1], isInWindow: false };
  };

  // Calculate actual calendar dates for the planting window
  const getPlantingDateRange = (plantingWindow, targetYear) => {
    if (!plantingWindow || !plantingWindow.weeks || plantingWindow.weeks.length === 0) {
      return null;
    }
    
    // Get first and last week in the window
    const firstWeek = plantingWindow.weeks[0].week;
    const lastWeek = plantingWindow.weeks[plantingWindow.weeks.length - 1].week;
    
    // Convert week numbers to dates for the target year
    const startDate = new Date(targetYear, 0, 1); // Jan 1 of target year
    startDate.setDate(startDate.getDate() + (firstWeek - 1) * 7);
    
    const endDate = new Date(targetYear, 0, 1);
    endDate.setDate(endDate.getDate() + lastWeek * 7);
    
    return {
      startDate,
      endDate,
      startStr: startDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      endStr: endDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    };
  };

  // Get season name from planting window
  const getSeasonName = (plantingWindow) => {
    if (!plantingWindow) return 'Unknown';
    
    const { fromSeason, toSeason } = plantingWindow;
    
    // Map season codes to readable names
    const seasonNames = {
      cold: 'Cold',
      cool: 'Cool',
      warm: 'Warm',
      hot: 'Hot'
    };
    
    const fromName = seasonNames[fromSeason] || fromSeason;
    const toName = seasonNames[toSeason] || toSeason;
    
    // Create descriptive name
    if (fromSeason === toSeason) {
      return `${fromName} Season`;
    } else {
      return `${fromName} to ${toName} Transition`;
    }
  };

  const handleSubmit = async () => {
    if (!targetDate) {
      alert('Please enter a target date');
      return;
    }
    
    // Get target year for planting
    const targetYear = new Date(targetDate).getFullYear();
    
    // Fetch weather data for this zip code if not already loaded
    // This will use PREVIOUS year's weather (targetYear - 1) to predict current year
    if (!weatherData) {
      const fetchedData = await fetchWeatherData(zipCode, targetYear);
      // If fetch failed, processWeatherData will use hardcoded data
    }
    
    const windowResult = findPlantingWindow(targetDate);
    const { seasonData } = processWeatherData();
    const eligiblePlants = getEligiblePlants(windowResult.plantingWindow, seasonData);
    
    // Calculate planting date range
    const dateRange = getPlantingDateRange(windowResult.plantingWindow, targetYear);
    
    // Get season name
    const seasonName = getSeasonName(windowResult.plantingWindow);
    
    setResult({ 
      ...windowResult, 
      eligiblePlants,
      seasonName,
      dateRange,
      targetYear
    });
  };

  const calculateCapacity = () => {
    const perimeter = (bedLength * 2) + (bedWidth * 2);
    
    return {
      maxHerbs: perimeter - 4,
      maxFlowers: perimeter - 6,
      minLarge: (bedLength - 2) * 2,
      minMedium: (bedLength - 2) * 4,
      minSmallXS: (bedLength - 2) * 8
    };
  };

  const analyzeSelection = () => {
    const selectedPlantObjects = selectedPlants.map(name => 
      plantDatabase.find(p => p.name === name)
    ).filter(Boolean);

    const herbs = selectedPlantObjects.filter(p => p.category === 'Herb').length;
    const flowers = selectedPlantObjects.filter(p => p.category === 'Flower').length;
    const largeVeggies = selectedPlantObjects.filter(p => p.category === 'Vegetable' && (p.size === 'L' || p.size === 'XL')).length;
    const mediumVeggies = selectedPlantObjects.filter(p => p.category === 'Vegetable' && p.size === 'M').length;
    const smallXSVeggies = selectedPlantObjects.filter(p => p.category === 'Vegetable' && (p.size === 'S' || p.size === 'XS')).length;

    const capacity = calculateCapacity();
    const warnings = [];
    const suggestions = [];

    if (herbs > capacity.maxHerbs) {
      warnings.push(`Too many herbs! Maximum: ${capacity.maxHerbs}, Selected: ${herbs}`);
    }
    if (flowers > capacity.maxFlowers) {
      warnings.push(`Too many flowers! Maximum: ${capacity.maxFlowers}, Selected: ${flowers}`);
    }
    if (largeVeggies < capacity.minLarge) {
      suggestions.push(`Consider adding ${capacity.minLarge - largeVeggies} more large vegetables to fill the center`);
    }
    if (mediumVeggies < capacity.minMedium) {
      suggestions.push(`You have room for ${capacity.minMedium - mediumVeggies} more medium vegetables`);
    }
    if (smallXSVeggies < capacity.minSmallXS) {
      suggestions.push(`You have room for ${capacity.minSmallXS - smallXSVeggies} more small vegetables`);
    }

    return { 
      warnings, 
      suggestions, 
      capacity, 
      counts: { 
        herbs, 
        flowers, 
        large: largeVeggies, 
        medium: mediumVeggies, 
        smallXS: smallXSVeggies 
      } 
    };
  };

  const handleGenerateLayout = () => {
    if (selectedPlants.length === 0) {
      alert('Please select some plants first!');
      return;
    }
    const layout = generateSmartLayout();
    console.log('Generated layout:', layout); // Debug
    setGeneratedLayout(layout);
    setShowLayout(true);
  };

  const generateSmartLayout = () => {
    const selectedPlantObjects = selectedPlants.map(name => 
      plantDatabase.find(p => p.name === name)
    ).filter(Boolean);

    console.log('Selected plant objects:', selectedPlantObjects);

    // Categorize plants
    const largeXLPlants = selectedPlantObjects.filter(p => p.size === 'XL' || p.size === 'XXL');
    const largePlants = selectedPlantObjects.filter(p => p.size === 'L');
    const mediumPlants = selectedPlantObjects.filter(p => p.size === 'M');
    const smallPlants = selectedPlantObjects.filter(p => p.size === 'S');
    const xsPlants = selectedPlantObjects.filter(p => p.size === 'XS');
    const perennialHerbs = selectedPlantObjects.filter(p => p.perennial && !p.separate);

    console.log('Categorized plants:', {
      largeXL: largeXLPlants.map(p => p.name),
      large: largePlants.map(p => p.name),
      medium: mediumPlants.map(p => p.name),
      small: smallPlants.map(p => p.name),
      xs: xsPlants.map(p => p.name)
    });

    const layout = [];
    const pixelsPerInch = 4;
    const bedWidthInches = bedWidth * 12;
    const bedLengthInches = bedLength * 12;
    const svgWidth = bedLengthInches * pixelsPerInch + 40;
    const svgHeight = bedWidthInches * pixelsPerInch + 40;
    const centerY = svgHeight / 2;

    // STEP 1: Place CENTER plants (XL > L > Medium vegetables fallback)
    let centerPlants = largeXLPlants.length > 0 ? largeXLPlants : 
                       largePlants.length > 0 ? largePlants :
                       mediumPlants.filter(p => p.category === 'Vegetable');
    let centerRadius = 0;
    
    if (centerPlants.length > 0) {
      const plantSpacingInches = centerPlants[0].spacing;
      centerRadius = plantSpacingInches * pixelsPerInch;
      const plantSpacing = plantSpacingInches * 2 * pixelsPerInch;
      
      // Check if we can fit plants in BOTH dimensions (2D grid)
      const horizontalSpace = bedLengthInches * pixelsPerInch - 60;
      const verticalSpace = bedWidthInches * pixelsPerInch - 60;
      const numHorizontal = Math.max(1, Math.floor(horizontalSpace / plantSpacing));
      const numVertical = Math.max(1, Math.floor(verticalSpace / plantSpacing));
      
      console.log('Center plant calculation:', {
        plantSpacingInches,
        plantSpacing,
        numHorizontal,
        numVertical,
        totalPlants: numHorizontal * numVertical
      });
      
      // If both dimensions can fit multiple plants, create a 2D grid
      if (numHorizontal > 1 && numVertical > 1) {
        const startX = (svgWidth / 2) - ((numHorizontal - 1) * plantSpacing / 2);
        const startY = (svgHeight / 2) - ((numVertical - 1) * plantSpacing / 2);
        
        for (let row = 0; row < numVertical; row++) {
          for (let col = 0; col < numHorizontal; col++) {
            const plantIndex = (row * numHorizontal) + col;
            const plant = centerPlants[plantIndex % centerPlants.length];
            const x = startX + (col * plantSpacing);
            const y = startY + (row * plantSpacing);
            layout.push({ plant, x, y, location: 'center' });
          }
        }
      } else {
        // Place along the longer axis (1D)
        const alongLength = bedLengthInches >= bedWidthInches;
        const numCenterPlants = alongLength ? numHorizontal : numVertical;
        const startX = alongLength ? ((svgWidth / 2) - ((numCenterPlants - 1) * plantSpacing / 2)) : (svgWidth / 2);
        const startY = alongLength ? centerY : ((svgHeight / 2) - ((numCenterPlants - 1) * plantSpacing / 2));
        
        for (let i = 0; i < numCenterPlants; i++) {
          const plant = centerPlants[i % centerPlants.length];
          const x = alongLength ? (startX + (i * plantSpacing)) : startX;
          const y = alongLength ? centerY : (startY + (i * plantSpacing));
          layout.push({ plant, x, y, location: 'center' });
        }
      }
    }

    // Calculate capacity limits FIRST
    const perimeter = (bedLength * 2) + (bedWidth * 2);
    const maxHerbs = perimeter - 4;
    const maxFlowers = perimeter - 6;

    // STEP 2: Place CORNERS (Medium herbs > Small herbs/flowers)
    const mediumHerbs = mediumPlants.filter(p => p.category === 'Herb');
    const smallFlowersHerbs = smallPlants.filter(p => p.category === 'Flower' || p.category === 'Herb');
    
    const cornerPlants = perennialHerbs.length > 0 ? perennialHerbs :
                         mediumHerbs.length > 0 ? mediumHerbs :
                         smallFlowersHerbs;
    
    let cornersPlaced = 0;
    if (cornerPlants.length > 0) {
      const plantRadius = cornerPlants[0].spacing * pixelsPerInch;
      const edgeMargin = 15;
      const corners = [
        { x: edgeMargin + plantRadius, y: edgeMargin + plantRadius },
        { x: svgWidth - edgeMargin - plantRadius, y: edgeMargin + plantRadius },
        { x: edgeMargin + plantRadius, y: svgHeight - edgeMargin - plantRadius },
        { x: svgWidth - edgeMargin - plantRadius, y: svgHeight - edgeMargin - plantRadius }
      ];
      
      // Check if corner plants are herbs or flowers and respect limits
      const isHerb = cornerPlants[0].category === 'Herb';
      const isFlower = cornerPlants[0].category === 'Flower';
      const cornerLimit = isHerb ? maxHerbs : isFlower ? maxFlowers : Infinity;
      
      corners.forEach((corner, i) => {
        if (cornersPlaced < Math.min(4, cornerLimit)) {
          const plant = cornerPlants[i % cornerPlants.length];
          layout.push({ plant, x: corner.x, y: corner.y, location: 'corner' });
          cornersPlaced++;
        }
      });
      
      console.log('Placed in corners:', cornerPlants[0].name, 'count:', cornersPlaced);
    }

    // STEP 3: Place BORDER - Reserve gaps next to corners, distribute remaining plants
    const borderSmallPlants = smallPlants.filter(p => p.category === 'Flower' || p.category === 'Herb');
    const allBorderPositions = []; // Track all border positions
    let totalGapInches = 0;
    let totalPlants = 0;
    
    if (borderSmallPlants.length > 0) {
      const smallRadius = borderSmallPlants[0].spacing * pixelsPerInch;
      const plantDiameter = borderSmallPlants[0].spacing * 2; // Occupied space per plant (in inches)
      const borderMargin = 18;
      const cornerBuffer = cornerPlants.length > 0 ? cornerPlants[0].spacing * pixelsPerInch * 2.5 : smallRadius * 3;
      
      // Calculate perimeter length available for border plants
      const topBottomLength = (bedLengthInches * pixelsPerInch) - (2 * cornerBuffer);
      const leftRightLength = (bedWidthInches * pixelsPerInch) - (2 * cornerBuffer);
      const totalPerimeterPx = (topBottomLength * 2) + (leftRightLength * 2);
      const totalPerimeterInches = totalPerimeterPx / pixelsPerInch;
      
      // Calculate corner occupied space
      const cornerPlantDiameter = cornerPlants.length > 0 ? cornerPlants[0].spacing * 2 : 0;
      const cornerOccupiedInches = cornersPlaced * cornerPlantDiameter;
      
      // Calculate limits
      const isHerb = borderSmallPlants[0].category === 'Herb';
      const isFlower = borderSmallPlants[0].category === 'Flower';
      const limit = isHerb ? maxHerbs : isFlower ? maxFlowers : Infinity;
      const borderPlantsToPlace = limit - cornersPlaced;
      
      // Total plants = corners + border
      totalPlants = cornersPlaced + borderPlantsToPlace;
      
      // Calculate gap spacing
      const borderOccupiedInches = borderPlantsToPlace * plantDiameter;
      const totalOccupiedInches = cornerOccupiedInches + borderOccupiedInches;
      totalGapInches = totalPerimeterInches - totalOccupiedInches;
      const gapSpacingInches = totalGapInches / totalPlants;
      const gapSpacingPx = gapSpacingInches * pixelsPerInch;
      
      console.log('Border distribution plan:', {
        totalPerimeterInches,
        plantDiameter,
        cornerPlantDiameter,
        cornersPlaced,
        borderPlantsToPlace,
        totalPlants,
        gapSpacingInches,
        totalOccupiedInches,
        totalGapInches
      });
      
      // STRATEGY: Reserve gap space adjacent to each corner (8 gaps for 4 corners)
      // Then distribute remaining plants in the available space between reserved gaps
      
      // Each corner has 2 adjacent gaps (one on each side)
      const reservedGapsPerCorner = 2;
      const totalReservedGaps = cornersPlaced * reservedGapsPerCorner; // 8 gaps
      const reservedGapInches = totalReservedGaps * gapSpacingInches;
      
      // Available space for distributing plants = perimeter - corners - reserved gaps
      const availableForDistribution = totalPerimeterInches - cornerOccupiedInches - reservedGapInches;
      
      // Calculate how many plants fit on each edge
      // Each plant needs: plantDiameter + gap
      const plantPlusGapInches = plantDiameter + gapSpacingInches;
      const plantPlusGapPx = plantPlusGapInches * pixelsPerInch;
      
      console.log('Distribution with reserved gaps:', {
        reservedGapsPerCorner,
        totalReservedGaps,
        reservedGapInches,
        availableForDistribution,
        plantDiameter,
        gapSpacingInches,
        plantPlusGapInches
      });
      
      // Start position: from edge of corner plant (radius) + reserved gap
      // Corner is at edgeMargin + cornerRadius from the actual corner
      // So first plant should be at: edgeMargin + cornerRadius + gap
      const cornerPlantRadius = cornerPlants.length > 0 ? (cornerPlants[0].spacing * pixelsPerInch) : 0;
      const edgeMargin = 15; // From corner placement
      
      // Distance from corner edge where plants can start
      // = corner plant radius + gap + small plant radius
      const startOffset = cornerPlantRadius + gapSpacingPx + smallRadius;
      
      console.log('Start offset calculation:', {
        cornerPlantRadius,
        gapSpacingPx,
        smallRadius,
        startOffset,
        startOffsetInches: startOffset / pixelsPerInch
      });
      
      // Distribute plants around perimeter, starting after each corner's reserved gap
      let currentDistance = startOffset;
      let plantsPlaced = 0;
      
      // Top edge (between top-left and top-right corners)
      while (currentDistance + smallRadius < topBottomLength - startOffset + smallRadius && plantsPlaced < borderPlantsToPlace) {
        const x = cornerBuffer + currentDistance;
        const y = borderMargin + smallRadius;
        const plant = borderSmallPlants[plantsPlaced % borderSmallPlants.length];
        layout.push({ plant, x, y, location: 'perimeter' });
        allBorderPositions.push({ x, y, hasPlant: true });
        plantsPlaced++;
        currentDistance += plantPlusGapPx;
      }
      
      // Right edge (between top-right and bottom-right corners)
      currentDistance = startOffset;
      while (currentDistance + smallRadius < leftRightLength - startOffset + smallRadius && plantsPlaced < borderPlantsToPlace) {
        const x = svgWidth - borderMargin - smallRadius;
        const y = cornerBuffer + currentDistance;
        const plant = borderSmallPlants[plantsPlaced % borderSmallPlants.length];
        layout.push({ plant, x, y, location: 'perimeter' });
        allBorderPositions.push({ x, y, hasPlant: true });
        plantsPlaced++;
        currentDistance += plantPlusGapPx;
      }
      
      // Bottom edge (between bottom-right and bottom-left corners)
      currentDistance = startOffset;
      while (currentDistance + smallRadius < topBottomLength - startOffset + smallRadius && plantsPlaced < borderPlantsToPlace) {
        const x = svgWidth - cornerBuffer - currentDistance;
        const y = svgHeight - borderMargin - smallRadius;
        const plant = borderSmallPlants[plantsPlaced % borderSmallPlants.length];
        layout.push({ plant, x, y, location: 'perimeter' });
        allBorderPositions.push({ x, y, hasPlant: true });
        plantsPlaced++;
        currentDistance += plantPlusGapPx;
      }
      
      // Left edge (between bottom-left and top-left corners)
      currentDistance = startOffset;
      while (currentDistance + smallRadius < leftRightLength - startOffset + smallRadius && plantsPlaced < borderPlantsToPlace) {
        const x = borderMargin + smallRadius;
        const y = svgHeight - cornerBuffer - currentDistance;
        const plant = borderSmallPlants[plantsPlaced % borderSmallPlants.length];
        layout.push({ plant, x, y, location: 'perimeter' });
        allBorderPositions.push({ x, y, hasPlant: true });
        plantsPlaced++;
        currentDistance += plantPlusGapPx;
      }
      
      console.log('Border plants placed:', plantsPlaced);
    }

    // STEP 4: Fill ALL available space with XS veggie clusters
    const xsVeggies = xsPlants.filter(p => p.category === 'Vegetable');
    if (xsVeggies.length > 0) {
      const xsRadius = xsVeggies[0].spacing * pixelsPerInch;
      const xsClusterDiameter = xsVeggies[0].spacing * 2 * 2; // 2x2 cluster diameter in inches
      const xsClusterDiameterPx = xsClusterDiameter * pixelsPerInch;
      
      console.log('XS cluster requirements:', {
        xsClusterDiameter,
        xsClusterDiameterPx,
        xsClusterDiameterInches: xsClusterDiameter
      });
      
      // Strategy: Measure each edge segment between ALL plants (corners + border)
      // and fit as many clusters as possible in each segment
      
      const edgeMargin = 18;
      const gaps = [];
      
      // Collect ALL plants on perimeter (corners + border) with their positions
      const allPerimeterPlants = [];
      
      // Add corners
      if (cornersPlaced === 4 && cornerPlants.length > 0) {
        const cornerRadius = cornerPlants[0].spacing * pixelsPerInch;
        allPerimeterPlants.push({ x: edgeMargin + cornerRadius, y: edgeMargin + cornerRadius, radius: cornerRadius, edge: 'TL' });
        allPerimeterPlants.push({ x: svgWidth - edgeMargin - cornerRadius, y: edgeMargin + cornerRadius, radius: cornerRadius, edge: 'TR' });
        allPerimeterPlants.push({ x: svgWidth - edgeMargin - cornerRadius, y: svgHeight - edgeMargin - cornerRadius, radius: cornerRadius, edge: 'BR' });
        allPerimeterPlants.push({ x: edgeMargin + cornerRadius, y: svgHeight - edgeMargin - cornerRadius, radius: cornerRadius, edge: 'BL' });
      }
      
      // Add border plants
      const smallRadius = borderSmallPlants.length > 0 ? borderSmallPlants[0].spacing * pixelsPerInch : 12;
      allBorderPositions.forEach(pos => {
        allPerimeterPlants.push({ x: pos.x, y: pos.y, radius: smallRadius });
      });
      
      // Separate plants by edge
      const topEdgePlants = allPerimeterPlants.filter(p => Math.abs(p.y - (edgeMargin + smallRadius)) < 15).sort((a, b) => a.x - b.x);
      const rightEdgePlants = allPerimeterPlants.filter(p => Math.abs(p.x - (svgWidth - edgeMargin - smallRadius)) < 15).sort((a, b) => a.y - b.y);
      const bottomEdgePlants = allPerimeterPlants.filter(p => Math.abs(p.y - (svgHeight - edgeMargin - smallRadius)) < 15).sort((a, b) => a.x - b.x);
      const leftEdgePlants = allPerimeterPlants.filter(p => Math.abs(p.x - (edgeMargin + smallRadius)) < 15).sort((a, b) => a.y - b.y);
      
      console.log('Plants per edge:', {
        top: topEdgePlants.length,
        right: rightEdgePlants.length,
        bottom: bottomEdgePlants.length,
        left: leftEdgePlants.length
      });
      
      // Helper function to fill edge segment with clusters
      const fillEdgeWithClusters = (plants, isHorizontal) => {
        for (let i = 0; i < plants.length - 1; i++) {
          const plant1 = plants[i];
          const plant2 = plants[i + 1];
          
          // Calculate edge-to-edge gap
          let distance, edgeToEdgeGap;
          if (isHorizontal) {
            distance = plant2.x - plant1.x;
            edgeToEdgeGap = distance - plant1.radius - plant2.radius;
          } else {
            distance = plant2.y - plant1.y;
            edgeToEdgeGap = distance - plant1.radius - plant2.radius;
          }
          
          // How many clusters fit?
          const numClusters = Math.floor(edgeToEdgeGap / xsClusterDiameterPx);
          
          if (numClusters >= 1) {
            // Distribute clusters evenly in the gap
            const clusterSpacing = edgeToEdgeGap / numClusters;
            const startPos = isHorizontal ? plant1.x + plant1.radius : plant1.y + plant1.radius;
            
            for (let c = 0; c < numClusters; c++) {
              const offset = (c * clusterSpacing) + (clusterSpacing / 2);
              if (isHorizontal) {
                const x = startPos + offset;
                const y = plant1.y; // Same y as the edge plants
                gaps.push({ x, y, numClusters, gapInches: edgeToEdgeGap / pixelsPerInch });
              } else {
                const x = plant1.x; // Same x as the edge plants
                const y = startPos + offset;
                gaps.push({ x, y, numClusters, gapInches: edgeToEdgeGap / pixelsPerInch });
              }
            }
          }
        }
      };
      
      // Fill each edge
      fillEdgeWithClusters(topEdgePlants, true);
      fillEdgeWithClusters(rightEdgePlants, false);
      fillEdgeWithClusters(bottomEdgePlants, true);
      fillEdgeWithClusters(leftEdgePlants, false);
      
      console.log('Total XS cluster positions found:', gaps.length, gaps.map(g => ({
        gapInches: g.gapInches.toFixed(1),
        clustersInGap: g.numClusters
      })));
      
      // Place XS clusters in gaps
      gaps.forEach(gap => {
        const plant = xsVeggies[0];
        const offset = xsRadius * 0.7;
        
        layout.push({ plant, x: gap.x - offset, y: gap.y - offset, location: 'perimeter', cluster: true });
        layout.push({ plant, x: gap.x + offset, y: gap.y - offset, location: 'perimeter', cluster: true });
        layout.push({ plant, x: gap.x - offset, y: gap.y + offset, location: 'perimeter', cluster: true });
        layout.push({ plant, x: gap.x + offset, y: gap.y + offset, location: 'perimeter', cluster: true });
      });
      
      console.log('XS clusters placed:', gaps.length);
    }

    // STEP 5: Place MEDIUM vegetables with overlap tolerance (6 sq inches max)
    const mediumVeggies = mediumPlants.filter(p => p.category === 'Vegetable');
    if (mediumVeggies.length > 0) {
      const mediumRadius = mediumVeggies[0].spacing * pixelsPerInch;
      const mediumSpacing = mediumVeggies[0].spacing * 2 * pixelsPerInch;
      const maxOverlapSqInches = 9;
      const maxOverlapSqPx = maxOverlapSqInches * (pixelsPerInch * pixelsPerInch);
      
      // Helper: Calculate circle overlap area
      const calculateOverlapArea = (x1, y1, r1, x2, y2, r2) => {
        const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (d >= r1 + r2) return 0;
        if (d <= Math.abs(r1 - r2)) {
          const smallerR = Math.min(r1, r2);
          return Math.PI * smallerR * smallerR;
        }
        const part1 = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
        const part2 = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
        const part3 = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
        return part1 + part2 - part3;
      };
      
      // Helper: Check overlap and show details for debugging
      const hasAcceptableOverlap = (x, y, debugMode = false) => {
        const overlaps = [];
        for (const existing of layout) {
          const existingRadius = existing.plant.spacing * pixelsPerInch;
          const overlap = calculateOverlapArea(x, y, mediumRadius, existing.x, existing.y, existingRadius);
          if (overlap > 0.1) { // Track significant overlaps
            overlaps.push({
              plant: existing.plant.name,
              location: existing.location,
              pos: `(${existing.x.toFixed(0)},${existing.y.toFixed(0)})`,
              overlap: (overlap / (pixelsPerInch * pixelsPerInch)).toFixed(2)
            });
          }
          if (overlap > maxOverlapSqPx) return false;
        }
        if (debugMode && overlaps.length > 0) {
          console.log(`Position (${x.toFixed(0)},${y.toFixed(0)}) overlaps:`, overlaps);
        }
        return true;
      };
      
      // Generate candidate positions
      const candidates = [];
      const gridSpacing = mediumSpacing * 0.5; // 18px for 4.5" plants
      const margin = 40;
      
      // FIRST: Explicitly add the 4 ideal corner positions
      // These might not land exactly on the grid
      const cornerPositions = [
        { x: margin + mediumRadius, y: margin + mediumRadius },
        { x: svgWidth - margin - mediumRadius, y: margin + mediumRadius },
        { x: margin + mediumRadius, y: svgHeight - margin - mediumRadius },
        { x: svgWidth - margin - mediumRadius, y: svgHeight - margin - mediumRadius }
      ];
      
      cornerPositions.forEach(pos => {
        if (hasAcceptableOverlap(pos.x, pos.y)) {
          let totalOverlap = 0;
          for (const existing of layout) {
            const existingRadius = existing.plant.spacing * pixelsPerInch;
            totalOverlap += calculateOverlapArea(pos.x, pos.y, mediumRadius, existing.x, existing.y, existingRadius);
          }
          candidates.push({ x: pos.x, y: pos.y, overlapScore: totalOverlap, priority: 'corner' });
        }
      });
      
      // THEN: Do grid search for additional positions
      for (let x = margin + mediumRadius; x < svgWidth - margin - mediumRadius; x += gridSpacing) {
        for (let y = margin + mediumRadius; y < svgHeight - margin - mediumRadius; y += gridSpacing) {
          // Skip if we already added this as a corner (within 5px)
          const isCorner = cornerPositions.some(c => Math.abs(c.x - x) < 5 && Math.abs(c.y - y) < 5);
          if (isCorner) continue;
          
          if (hasAcceptableOverlap(x, y)) {
            let totalOverlap = 0;
            for (const existing of layout) {
              const existingRadius = existing.plant.spacing * pixelsPerInch;
              totalOverlap += calculateOverlapArea(x, y, mediumRadius, existing.x, existing.y, existingRadius);
            }
            candidates.push({ x, y, overlapScore: totalOverlap });
          }
        }
      }
      
      // Remove the misleading debug calls that check at the wrong time
      console.log('Generated', candidates.length, 'candidate positions');
      
      // DEBUG: Check symmetrical positions
      // Note: SVG has +40px margin, so center is at (svgWidth/2, svgHeight/2)
      const centerX = svgWidth / 2;
      const centerY = svgHeight / 2;
      const cornerMargin = 40;
      
      const testPositions = [
        { x: cornerMargin + mediumRadius, y: cornerMargin + mediumRadius, label: 'top-left' },
        { x: svgWidth - cornerMargin - mediumRadius, y: cornerMargin + mediumRadius, label: 'top-right' },
        { x: cornerMargin + mediumRadius, y: svgHeight - cornerMargin - mediumRadius, label: 'bottom-left' },
        { x: svgWidth - cornerMargin - mediumRadius, y: svgHeight - cornerMargin - mediumRadius, label: 'bottom-right' }
      ];
      
      console.log('=== SYMMETRY CHECK ===');
      testPositions.forEach(test => {
        console.log(`\nPosition ${test.label} (${test.x}, ${test.y}):`);
        let totalOverlap = 0;
        const overlaps = [];
        
        for (const existing of layout) {
          const existingRadius = existing.plant.spacing * pixelsPerInch;
          const overlap = calculateOverlapArea(test.x, test.y, mediumRadius, existing.x, existing.y, existingRadius);
          if (overlap > 0.01) {
            overlaps.push({
              plant: existing.plant.name,
              location: existing.location,
              pos: `(${existing.x.toFixed(0)}, ${existing.y.toFixed(0)})`,
              radius: existingRadius.toFixed(1),
              distance: Math.sqrt(Math.pow(test.x - existing.x, 2) + Math.pow(test.y - existing.y, 2)).toFixed(1),
              overlap: (overlap / (pixelsPerInch * pixelsPerInch)).toFixed(2) + ' sq in'
            });
            totalOverlap += overlap;
          }
        }
        
        console.log(`  Total overlap: ${(totalOverlap / (pixelsPerInch * pixelsPerInch)).toFixed(2)} sq in`);
        if (overlaps.length > 0) {
          console.log('  Overlapping plants:', overlaps);
        } else {
          console.log('  No overlaps!');
        }
      });
      
      candidates.sort((a, b) => a.overlapScore - b.overlapScore);
      
      console.log('Medium vegetable candidates:', candidates.length, 'best overlap:', 
                  candidates[0] ? (candidates[0].overlapScore / (pixelsPerInch * pixelsPerInch)).toFixed(1) + ' sq in' : 'none');
      
      // Prefer positions that create balanced layout
      // Define preferred zones: corners and edges, avoid clustering in interior
      const preferredPositions = [];
      
      // For each candidate, calculate preference score
      candidates.forEach(pos => {
        const distFromCenterX = Math.abs(pos.x - svgWidth / 2);
        const distFromCenterY = Math.abs(pos.y - svgHeight / 2);
        const distFromEdgeX = Math.min(pos.x - margin, svgWidth - margin - pos.x);
        const distFromEdgeY = Math.min(pos.y - margin, svgHeight - margin - pos.y);
        const distFromAnyEdge = Math.min(distFromEdgeX, distFromEdgeY);
        
        // Prefer corners and edge positions over interior
        const isNearCorner = (pos.x < svgWidth * 0.3 || pos.x > svgWidth * 0.7) && 
                             (pos.y < svgHeight * 0.3 || pos.y > svgHeight * 0.7);
        const isNearEdge = distFromAnyEdge < 60; // Within 60px of an edge
        
        // Score: lower is better
        let positionScore = pos.overlapScore;
        
        // Strong preference for corners (marked as priority:'corner')
        if (pos.priority === 'corner') positionScore *= 0.5;
        // Good preference for edge positions
        else if (isNearEdge) positionScore *= 0.7;
        // Slight preference for corner quadrants
        else if (isNearCorner) positionScore *= 0.85;
        // Penalize interior positions
        else positionScore *= 1.5;
        
        preferredPositions.push({ ...pos, positionScore, isNearEdge, isNearCorner });
      });
      
      // Sort by combined score (overlap + position preference)
      preferredPositions.sort((a, b) => a.positionScore - b.positionScore);
      
      console.log('Top 10 positions:', preferredPositions.slice(0, 10).map(p => ({
        x: p.x.toFixed(0),
        y: p.y.toFixed(0),
        overlap: (p.overlapScore / (pixelsPerInch * pixelsPerInch)).toFixed(1) + ' sq in',
        edge: p.isNearEdge,
        corner: p.isNearCorner
      })));
      
      // Place medium vegetables, alternating between types
      // LIMIT: Place max of 8 medium veggies for cleaner layouts
      const maxMediumVeggies = 8;
      let plantIndex = 0;
      preferredPositions.forEach((pos) => {
        if (plantIndex < maxMediumVeggies) {
          // Re-check if this position still has acceptable overlap
          if (hasAcceptableOverlap(pos.x, pos.y)) {
            const plant = mediumVeggies[plantIndex % mediumVeggies.length];
            layout.push({ plant, x: pos.x, y: pos.y, location: 'inner-ring' });
            plantIndex++;
          }
        }
      });
      
      console.log(`Medium vegetables placed: ${plantIndex} (alternating between ${mediumVeggies.length} types)`);
    }

    // STEP 6: Place SMALL vegetables in remaining gaps (if any)
    const smallVeggies = smallPlants.filter(p => p.category === 'Vegetable');
    // TODO: Add gap-filling logic for small vegetables

    return layout;
  };

  const { seasonData, transitions } = processWeatherData();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-green-800 mb-2 flex items-center gap-2">
          <Sprout className="w-8 h-8" />
          Vegetable Bed Planting Tool
        </h1>
        <p className="text-gray-600 mb-6">Find the optimal planting window for your garden</p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="77478"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loadingWeather}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg"
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            {loadingWeather ? 'Loading Weather Data...' : 'Find Planting Window'}
          </button>
          {weatherError && (
            <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-3 rounded">
              ⚠️ {weatherError} Using default weather data.
            </div>
          )}
          {weatherData && !weatherError && (
            <div className="mt-2 text-sm text-green-600">
              ✓ Using weather data for your location
              {weatherData[0]?.year && (
                <span className="ml-2 text-gray-600">
                  (Based on {weatherData[0].year} weather patterns)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {result && result.eligiblePlants && result.eligiblePlants.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Eligible Plants ({result.eligiblePlants.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {result.eligiblePlants.map((plant, idx) => (
              <div
                key={idx}
                className={`border-2 rounded-lg p-3 cursor-pointer ${
                  selectedPlants.includes(plant.name)
                    ? 'bg-green-100 border-green-500'
                    : 'bg-white border-gray-300 hover:border-green-300'
                }`}
                onClick={() => {
                  if (selectedPlants.includes(plant.name)) {
                    setSelectedPlants(selectedPlants.filter(p => p !== plant.name));
                  } else {
                    setSelectedPlants([...selectedPlants, plant.name]);
                  }
                }}
              >
                <div className="font-semibold text-sm">{plant.name}</div>
                <div className="text-xs text-gray-600">{plant.daysToMaturity} days</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPlants.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Garden Layout</h2>
          
          {(() => {
            const analysis = analyzeSelection();
            return (
              <>
                {analysis.warnings.length > 0 && (
                  <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Warnings</h3>
                    <ul className="list-disc list-inside text-yellow-700 text-sm">
                      {analysis.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
                
                {analysis.suggestions.length > 0 && (
                  <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">💡 Suggestions</h3>
                    <ul className="list-disc list-inside text-blue-700 text-sm">
                      {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}

                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Bed Capacity for {bedLength}' x {bedWidth}'</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Herbs:</span>
                      <span className={`ml-2 font-semibold ${analysis.counts.herbs > analysis.capacity.maxHerbs ? 'text-red-600' : 'text-green-600'}`}>
                        {analysis.counts.herbs} / {analysis.capacity.maxHerbs}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Flowers:</span>
                      <span className={`ml-2 font-semibold ${analysis.counts.flowers > analysis.capacity.maxFlowers ? 'text-red-600' : 'text-green-600'}`}>
                        {analysis.counts.flowers} / {analysis.capacity.maxFlowers}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Large Veggies:</span>
                      <span className="ml-2 font-semibold text-gray-700">
                        {analysis.counts.large} (min: {analysis.capacity.minLarge})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Medium Veggies:</span>
                      <span className="ml-2 font-semibold text-gray-700">
                        {analysis.counts.medium} (min: {analysis.capacity.minMedium})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Small Veggies:</span>
                      <span className="ml-2 font-semibold text-gray-700">
                        {analysis.counts.smallXS} (min: {analysis.capacity.minSmallXS})
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (feet)</label>
              <input
                type="number"
                value={bedLength}
                onChange={(e) => setBedLength(Number(e.target.value))}
                min="2"
                max="20"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
              <input
                type="number"
                value={bedWidth}
                onChange={(e) => setBedWidth(Number(e.target.value))}
                min="2"
                max="20"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={handleGenerateLayout}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-4"
          >
            Generate Layout
          </button>
          
          {showLayout && (
            <div className="mt-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">
                  {result.seasonName} {bedLength}' x {bedWidth}' Garden Bed
                </h3>
                {result.dateRange && (
                  <p className="text-sm text-gray-600 mt-1">
                    Planting Window: {result.dateRange.startStr} to {result.dateRange.endStr}
                  </p>
                )}
              </div>
              <svg 
                width={bedLength * 50 + 40} 
                height={bedWidth * 50 + 40} 
                className="border-8 border-amber-800 bg-white mx-auto rounded"
              >
                <rect x="0" y="0" width={bedLength * 50 + 40} height={bedWidth * 50 + 40} fill="#FAF9F6" />
                
                {/* Generate smart layout */}
                {generatedLayout.map((item, idx) => {
                  const { plant, x, y } = item;
                  const radius = plant.spacing * 4;
                  
                  // Assign unique colors per plant name
                  const plantColors = {
                    'Radish': '#8B2F39',
                    'Beets (Fall)': '#8B2F39',
                    'Beets (Spring)': '#8B2F39',
                    'Lettuce': '#90C695',
                    'Basil': '#6B8E23',
                    'Broccoli': '#4A7C59',
                    'Tomato (Fall)': '#C1440E',
                    'Tomato (Spring)': '#C1440E',
                    'Carrot (Fall)': '#D2691E',
                    'Carrot (Spring)': '#D2691E',
                    'Calendula': '#DAA520',
                    'Sweet Peppers': '#FF8C42',
                    'Spicy Peppers': '#DC143C',
                    'Kale (Fall)': '#2F4F4F',
                    'Kale (Spring)': '#2F4F4F',
                    'Summer Squash': '#9CAF88',
                    'Cucumber (Fall)': '#6B8E23',
                    'Cucumber (Spring)': '#6B8E23',
                    'Thyme': '#8B7355',
                    'Rosemary': '#556B2F',
                    'Lavender': '#9370DB',
                    'Mint': '#98FF98',
                    'Parsley': '#228B22',
                    'Cilantro': '#7CFC00',
                    'Oregano': '#556B2F',
                    'Marigold': '#FFD700',
                    'Nasturtium': '#FF6347',
                    'Pansy': '#9370DB',
                    'Strawberry': '#DC143C',
                    'Pumpkin': '#FF8C00',
                    'Watermelon': '#FF1493',
                    'Melon': '#FFB347',
                    'Eggplant': '#4B0082',
                    'Corn': '#F4A460',
                    'Onion (Fall)': '#DEB887'
                  };
                  
                  const color = plantColors[plant.name] || '#6B8E23';
                  
                  // Assign shapes based on plant name for variety
                  const getPlantShape = (plantName) => {
                    // XS plants: simple shapes
                    if (plant.size === 'XS') {
                      if (plantName.includes('Beets')) return 'x-shape';
                      if (plantName.includes('Carrot')) return 'diamond';
                      if (plantName.includes('Radish')) return 'circle';
                      return 'circle';
                    }
                    // S plants: 6-8 petal flowers
                    if (plant.size === 'S') {
                      if (plantName.includes('Lettuce')) return 'clover-4';
                      return 'flower-8';
                    }
                    // M plants: varied medium shapes
                    if (plant.size === 'M') {
                      if (plantName.includes('Calendula')) return 'flower-12';
                      if (plantName.includes('Pepper')) return 'flower-10';
                      if (plantName.includes('Kale')) return 'flower-8';
                      if (plantName.includes('Marigold')) return 'flower-12';
                      return 'cloud';
                    }
                    // L/XL plants: large scalloped shapes
                    return 'scallop';
                  };
                  
                  const shapeType = getPlantShape(plant.name);
                  
                  // X-shape (for Beets)
                  if (shapeType === 'x-shape') {
                    return (
                      <g key={idx} opacity="0.9">
                        <rect x={x - radius * 0.3} y={y - radius} width={radius * 0.6} height={radius * 2} fill={color} transform={`rotate(45 ${x} ${y})`} />
                        <rect x={x - radius * 0.3} y={y - radius} width={radius * 0.6} height={radius * 2} fill={color} transform={`rotate(-45 ${x} ${y})`} />
                      </g>
                    );
                  }
                  
                  // Diamond shape
                  if (shapeType === 'diamond') {
                    return (
                      <polygon key={idx} points={`${x},${y - radius} ${x + radius},${y} ${x},${y + radius} ${x - radius},${y}`} fill={color} opacity="0.9" />
                    );
                  }
                  
                  // Simple circle
                  if (shapeType === 'circle') {
                    return <circle key={idx} cx={x} cy={y} r={radius} fill={color} opacity="0.9" />;
                  }
                  
                  // 4-petal clover
                  if (shapeType === 'clover-4') {
                    return (
                      <g key={idx} opacity="0.9">
                        {[0, 1, 2, 3].map(i => {
                          const angle = (i * Math.PI * 2) / 4;
                          return (
                            <circle
                              key={i}
                              cx={x + Math.cos(angle) * radius * 0.6}
                              cy={y + Math.sin(angle) * radius * 0.6}
                              r={radius * 0.5}
                              fill={color}
                            />
                          );
                        })}
                        <circle cx={x} cy={y} r={radius * 0.4} fill={color} />
                      </g>
                    );
                  }
                  
                  // 8-petal flower
                  if (shapeType === 'flower-8') {
                    return (
                      <g key={idx} opacity="0.9">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                          const angle = (i * Math.PI * 2) / 8;
                          return (
                            <circle
                              key={i}
                              cx={x + Math.cos(angle) * radius * 0.7}
                              cy={y + Math.sin(angle) * radius * 0.7}
                              r={radius * 0.4}
                              fill={color}
                            />
                          );
                        })}
                        <circle cx={x} cy={y} r={radius * 0.5} fill={color} />
                      </g>
                    );
                  }
                  
                  // 10-petal flower
                  if (shapeType === 'flower-10') {
                    return (
                      <g key={idx} opacity="0.9">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                          const angle = (i * Math.PI * 2) / 10;
                          return (
                            <circle
                              key={i}
                              cx={x + Math.cos(angle) * radius * 0.7}
                              cy={y + Math.sin(angle) * radius * 0.7}
                              r={radius * 0.35}
                              fill={color}
                            />
                          );
                        })}
                        <circle cx={x} cy={y} r={radius * 0.4} fill={color} />
                      </g>
                    );
                  }
                  
                  // 12-petal flower
                  if (shapeType === 'flower-12') {
                    return (
                      <g key={idx} opacity="0.9">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
                          const angle = (i * Math.PI * 2) / 12;
                          return (
                            <circle
                              key={i}
                              cx={x + Math.cos(angle) * radius * 0.7}
                              cy={y + Math.sin(angle) * radius * 0.7}
                              r={radius * 0.35}
                              fill={color}
                            />
                          );
                        })}
                        <circle cx={x} cy={y} r={radius * 0.45} fill={color} />
                      </g>
                    );
                  }
                  
                  // Cloud shape
                  if (shapeType === 'cloud') {
                    return (
                      <g key={idx} opacity="0.9">
                        <circle cx={x - radius * 0.3} cy={y} r={radius * 0.6} fill={color} />
                        <circle cx={x + radius * 0.3} cy={y} r={radius * 0.6} fill={color} />
                        <circle cx={x} cy={y - radius * 0.3} r={radius * 0.7} fill={color} />
                        <circle cx={x} cy={y + radius * 0.3} r={radius * 0.5} fill={color} />
                      </g>
                    );
                  }
                  
                  // Scalloped shape for large plants
                  if (shapeType === 'scallop') {
                    let path = `M ${x},${y} `;
                    for (let i = 0; i < 16; i++) {
                      const angle = (i * Math.PI * 2) / 16;
                      const r = radius * (0.85 + Math.sin(angle * 4) * 0.15);
                      path += `L ${x + Math.cos(angle) * r},${y + Math.sin(angle) * r} `;
                    }
                    path += 'Z';
                    return <path key={idx} d={path} fill={color} opacity="0.9" />;
                  }
                  
                  return null;
                })}
              </svg>
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Plant Key</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[...new Set(selectedPlants)].map((plantName, idx) => {
                    const plant = plantDatabase.find(p => p.name === plantName);
                    if (!plant) return null;
                    
                    // Use same color mapping as main display
                    const plantColors = {
                      'Radish': '#8B2F39',
                      'Beets (Fall)': '#8B2F39',
                      'Beets (Spring)': '#8B2F39',
                      'Lettuce': '#90C695',
                      'Basil': '#6B8E23',
                      'Broccoli': '#4A7C59',
                      'Tomato (Fall)': '#C1440E',
                      'Tomato (Spring)': '#C1440E',
                      'Carrot (Fall)': '#D2691E',
                      'Carrot (Spring)': '#D2691E',
                      'Calendula': '#DAA520',
                      'Sweet Peppers': '#FF8C42',
                      'Spicy Peppers': '#DC143C',
                      'Kale (Fall)': '#2F4F4F',
                      'Kale (Spring)': '#2F4F4F',
                      'Summer Squash': '#9CAF88',
                      'Cucumber (Fall)': '#6B8E23',
                      'Cucumber (Spring)': '#6B8E23',
                      'Thyme': '#8B7355',
                      'Rosemary': '#556B2F',
                      'Lavender': '#9370DB',
                      'Mint': '#98FF98',
                      'Parsley': '#228B22',
                      'Cilantro': '#7CFC00',
                      'Oregano': '#556B2F',
                      'Marigold': '#FFD700',
                      'Nasturtium': '#FF6347',
                      'Pansy': '#9370DB',
                      'Strawberry': '#DC143C',
                      'Pumpkin': '#FF8C00',
                      'Watermelon': '#FF1493',
                      'Melon': '#FFB347',
                      'Eggplant': '#4B0082',
                      'Corn': '#F4A460',
                      'Onion (Fall)': '#DEB887'
                    };
                    const color = plantColors[plant.name] || '#6B8E23';
                    
                    // Determine shape for key icon
                    const getKeyShape = () => {
                      if (plant.size === 'XS') {
                        if (plant.name.includes('Beets')) {
                          return (
                            <g>
                              <rect x="9" y="4" width="6" height="16" fill={color} transform="rotate(45 12 12)" />
                              <rect x="9" y="4" width="6" height="16" fill={color} transform="rotate(-45 12 12)" />
                            </g>
                          );
                        }
                        return <circle cx="12" cy="12" r="8" fill={color} />;
                      }
                      if (plant.size === 'S') {
                        return (
                          <g>
                            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                              const angle = (i * Math.PI * 2) / 8;
                              return (
                                <circle
                                  key={i}
                                  cx={12 + Math.cos(angle) * 5.6}
                                  cy={12 + Math.sin(angle) * 5.6}
                                  r="3.2"
                                  fill={color}
                                />
                              );
                            })}
                            <circle cx="12" cy="12" r="4" fill={color} />
                          </g>
                        );
                      }
                      if (plant.size === 'M') {
                        if (plant.name.includes('Calendula')) {
                          return (
                            <g>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
                                const angle = (i * Math.PI * 2) / 12;
                                return (
                                  <circle
                                    key={i}
                                    cx={12 + Math.cos(angle) * 5.6}
                                    cy={12 + Math.sin(angle) * 5.6}
                                    r="2.8"
                                    fill={color}
                                  />
                                );
                              })}
                              <circle cx="12" cy="12" r="3.6" fill={color} />
                            </g>
                          );
                        }
                        if (plant.name.includes('Pepper')) {
                          return (
                            <g>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                                const angle = (i * Math.PI * 2) / 10;
                                return (
                                  <circle
                                    key={i}
                                    cx={12 + Math.cos(angle) * 5.6}
                                    cy={12 + Math.sin(angle) * 5.6}
                                    r="2.8"
                                    fill={color}
                                  />
                                );
                              })}
                              <circle cx="12" cy="12" r="3.2" fill={color} />
                            </g>
                          );
                        }
                        return (
                          <g>
                            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                              const angle = (i * Math.PI * 2) / 8;
                              return (
                                <circle
                                  key={i}
                                  cx={12 + Math.cos(angle) * 5.6}
                                  cy={12 + Math.sin(angle) * 5.6}
                                  r="3.2"
                                  fill={color}
                                />
                              );
                            })}
                            <circle cx="12" cy="12" r="4" fill={color} />
                          </g>
                        );
                      }
                      // L/XL - scalloped
                      return (
                        <path
                          d="M 12,12 L 19.2,12 L 18.4,14.4 L 16,16.8 L 12.8,17.6 L 9.6,16.8 L 6.4,14.4 L 5.6,12 L 6.4,9.6 L 9.6,7.2 L 12.8,6.4 L 16,7.2 L 18.4,9.6 Z"
                          fill={color}
                        />
                      );
                    };
                    
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          {getKeyShape()}
                        </svg>
                        <span className="text-sm">{plant.name} - {plant.spacing}" ({plant.size})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Layout:</strong> Perennial herbs in corners, large plants in center, small/medium plants alternating around borders</p>
                <p className="mt-1"><em>Plant shapes show actual growing space (spacing = radius). Plants touching means proper spacing.</em></p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;