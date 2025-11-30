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

const [plantDatabase, setPlantDatabase] = useState([]);
const [loadingPlants, setLoadingPlants] = useState(false);

// Fetch plants from backend
React.useEffect(() => {
  const fetchPlants = async () => {
    try {
      setLoadingPlants(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/plants`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch plants');
      }
      
      const data = await response.json();
      setPlantDatabase(data.plants);
      setLoadingPlants(false);
      
    } catch (error) {
      console.error('Error fetching plants:', error);
      setPlantDatabase([]);
      setLoadingPlants(false);
    }
  };
  
  fetchPlants();
}, []);
  // Iframe height communication for embedding
    React.useEffect(() => {
      const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ 
          type: 'garden-planner-height',
          height: height 
        }, '*');
      };
      
      // Send height initially and on resize
      sendHeight();
      window.addEventListener('resize', sendHeight);
      
      // Send height when content changes
      const observer = new MutationObserver(sendHeight);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
      
      return () => {
        window.removeEventListener('resize', sendHeight);
        observer.disconnect();
      };
    }, []);
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
// Generate unique color palette for plants in this layout
const generatePlantColors = (layoutItems) => {
  const uniquePlants = [...new Set(layoutItems.map(item => item.plant.name))];
  const colors = {};
  
  // Color palettes by category
  const categoryColors = {
    'Herb': ['#6B8E23', '#556B2F', '#8B7355', '#228B22', '#7CFC00', '#98FF98'],
    'Flower': ['#DAA520', '#FFD700', '#FF6347', '#9370DB', '#FF1493', '#FFB347'],
    'Vegetable': ['#8B2F39', '#D2691E', '#FF8C42', '#DC143C', '#2F4F4F', '#9CAF88', '#C1440E', '#4A7C59']
  };
  
  // Assign colors to each unique plant
  uniquePlants.forEach((plantName, index) => {
    const plantData = layoutItems.find(item => item.plant.name === plantName)?.plant;
    const category = plantData?.category || 'Vegetable';
    const palette = categoryColors[category] || categoryColors['Vegetable'];
    
    // Cycle through palette colors
    colors[plantName] = palette[index % palette.length];
  });
  
  return colors;
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
  
    // After center plants placed
    console.log('After center placement:', {
      layoutLength: layout.length,
      centerPlants: layout.filter(l => l.location === 'center').length
    });
    // STEP 2: Place CORNER plants (herbs)
    console.log('Corner plants available:', perennialHerbs.map(p => p.name));
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
      console.log('After corner placement:', {
        layoutLength: layout.length,
        cornerPlants: layout.filter(l => l.location === 'corner').length
      });
    
    // STEP 3 & 4: Place BORDER plants with dynamic capacity (S plants + XS clusters)
    console.log('Border plants available:', smallPlants.map(p => p.name), 'XS plants:', xsPlants.map(p => p.name));
    
    // Build border units array
    const borderUnits = [];
    smallPlants.forEach(plant => {
      borderUnits.push({ plant, isCluster: false });
    });
    
    const xsVeggies = xsPlants.filter(p => p.category === 'Vegetable');
    xsVeggies.forEach(plant => {
      borderUnits.push({ plant, isCluster: true });
    });
    
    console.log('Border units:', borderUnits.map(u => ({ name: u.plant.name, isCluster: u.isCluster })));
    
    const borderSmallPlants = borderUnits.length > 0 
      ? borderUnits.map(u => u.plant)
      : mediumPlants.slice(0, 3);
    const allBorderPositions = [];
    
    if (borderUnits.length > 0) {
      const smallRadius = borderUnits[0].plant.spacing * pixelsPerInch;
      const plantDiameter = borderUnits[0].plant.spacing * 2;
      const borderMargin = 18;
      const cornerBuffer = cornerPlants.length > 0 ? cornerPlants[0].spacing * pixelsPerInch * 2.5 : smallRadius * 3;
      
      const topBottomLength = (bedLengthInches * pixelsPerInch) - (2 * cornerBuffer);
      const leftRightLength = (bedWidthInches * pixelsPerInch) - (2 * cornerBuffer);
      const totalPerimeterPx = (topBottomLength * 2) + (leftRightLength * 2);
      const totalPerimeterInches = totalPerimeterPx / pixelsPerInch;
      
      // DYNAMIC CAPACITY - calculate how many border units actually fit
      // Note: cornerBuffer already excludes corner space, so no need to subtract corner diameters again
      const borderPlantsToPlace = Math.floor(totalPerimeterInches / plantDiameter);
      
      console.log('Dynamic border capacity:', {
        totalPerimeterInches,
        plantDiameter,
        borderPlantsToPlace
      });
      
      const cornerPlantRadius = cornerPlants.length > 0 ? (cornerPlants[0].spacing * pixelsPerInch) : 0;
      const edgeMargin = 15;
      // Start border plants after corner plant radius + border plant radius
      const startOffset = cornerPlantRadius + smallRadius;
      
      // Helper to place unit (single or cluster)
      const placeUnit = (x, y, unitIndex) => {
        const unit = borderUnits[unitIndex % borderUnits.length];
        if (unit.isCluster) {
          const xsRadius = unit.plant.spacing * pixelsPerInch;
          const offset = xsRadius * 0.7;
          layout.push({ plant: unit.plant, x: x - offset, y: y - offset, location: 'perimeter', cluster: true });
          layout.push({ plant: unit.plant, x: x + offset, y: y - offset, location: 'perimeter', cluster: true });
          layout.push({ plant: unit.plant, x: x - offset, y: y + offset, location: 'perimeter', cluster: true });
          layout.push({ plant: unit.plant, x: x + offset, y: y + offset, location: 'perimeter', cluster: true });
        } else {
          layout.push({ plant: unit.plant, x, y, location: 'perimeter' });
        }
        allBorderPositions.push({ x, y, hasPlant: true });
      };
      
      // Calculate how many units go on each edge proportionally
      const totalEdgeLength = (topBottomLength * 2) + (leftRightLength * 2);
      const unitsOnTop = Math.round(borderPlantsToPlace * (topBottomLength / totalEdgeLength));
      const unitsOnRight = Math.round(borderPlantsToPlace * (leftRightLength / totalEdgeLength));
      const unitsOnBottom = Math.round(borderPlantsToPlace * (topBottomLength / totalEdgeLength));
      const unitsOnLeft = borderPlantsToPlace - unitsOnTop - unitsOnRight - unitsOnBottom;
      
      console.log('Units per edge:', { unitsOnTop, unitsOnRight, unitsOnBottom, unitsOnLeft, total: borderPlantsToPlace });
      
      let plantsPlaced = 0;
      
      // Top edge - distribute units evenly
      if (unitsOnTop > 0) {
        const topSpacing = topBottomLength / unitsOnTop;
        for (let i = 0; i < unitsOnTop; i++) {
          const x = cornerBuffer + startOffset + (i * topSpacing);
          const y = borderMargin + smallRadius;
          placeUnit(x, y, plantsPlaced);
          plantsPlaced++;
        }
      }
      
      // Right edge - distribute units evenly
      if (unitsOnRight > 0) {
        const rightSpacing = leftRightLength / unitsOnRight;
        for (let i = 0; i < unitsOnRight; i++) {
          const x = svgWidth - borderMargin - smallRadius;
          const y = cornerBuffer + startOffset + (i * rightSpacing);
          placeUnit(x, y, plantsPlaced);
          plantsPlaced++;
        }
      }
      
      // Bottom edge - distribute units evenly
      if (unitsOnBottom > 0) {
        const bottomSpacing = topBottomLength / unitsOnBottom;
        for (let i = 0; i < unitsOnBottom; i++) {
          const x = svgWidth - cornerBuffer - startOffset - (i * bottomSpacing);
          const y = svgHeight - borderMargin - smallRadius;
          placeUnit(x, y, plantsPlaced);
          plantsPlaced++;
        }
      }
      
      // Left edge - distribute units evenly
      if (unitsOnLeft > 0) {
        const leftSpacing = leftRightLength / unitsOnLeft;
        for (let i = 0; i < unitsOnLeft; i++) {
          const x = borderMargin + smallRadius;
          const y = svgHeight - cornerBuffer - startOffset - (i * leftSpacing);
          placeUnit(x, y, plantsPlaced);
          plantsPlaced++;
        }
      }
      
      console.log('Border units placed:', plantsPlaced);
    }
      console.log('After border placement:', {
        layoutLength: layout.length,
        borderPlants: layout.filter(l => l.location === 'perimeter').length
      });

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
        <p className="text-gray-600 mb-6">
          Find the optimal planting window for your garden
          {loadingPlants && <span> • Loading plants...</span>}
        </p>
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
                 // Generate unique color palette for plants in this layout
                const generatePlantColors = (layoutItems) => {
                  const uniquePlants = [...new Set(layoutItems.map(item => item.plant.name))];
                  const colors = {};
                  
                  // Color palettes by category
                  const categoryColors = {
                    'Herb': ['#6B8E23', '#556B2F', '#8B7355', '#228B22', '#7CFC00', '#98FF98'],
                    'Flower': ['#DAA520', '#FFD700', '#FF6347', '#9370DB', '#FF1493', '#FFB347'],
                    'Vegetable': ['#8B2F39', '#D2691E', '#FF8C42', '#DC143C', '#2F4F4F', '#9CAF88', '#C1440E', '#4A7C59']
                  };
                  
                  // Assign colors to each unique plant
                  uniquePlants.forEach((plantName, index) => {
                    const plantData = layoutItems.find(item => item.plant.name === plantName)?.plant;
                    const category = plantData?.category || 'Vegetable';
                    const palette = categoryColors[category] || categoryColors['Vegetable'];
                    
                    // Cycle through palette colors
                    colors[plantName] = palette[index % palette.length];
                  });
                  
                  return colors;
                };

                const plantColors = generatePlantColors(generatedLayout);
                  
                  const color = plantColors[plant.name] || '#6B8E23';
                  
                  // Assign shapes based on plant name for variety
                  const getPlantShape = (plantObj) => {
                    const category = plantObj.category || 'Vegetable';
                    const size = plantObj.size;
                    
                    // Herbs: Always flower shapes (varying petals by size)
                    if (category === 'Herb') {
                      if (size === 'XS') return 'flower-6';
                      if (size === 'S') return 'flower-8';
                      if (size === 'M') return 'flower-10';
                      return 'flower-12';
                    }
                    
                    // Flowers: Always flower shapes with more petals
                    if (category === 'Flower') {
                      if (size === 'XS') return 'flower-8';
                      if (size === 'S') return 'flower-10';
                      if (size === 'M') return 'flower-12';
                      return 'flower-12';
                    }
                    
                    // Vegetables: Varied shapes by size
                    if (size === 'XS') return 'x-shape';      // Root veggies
                    if (size === 'S') return 'clover-4';       // Small veggies
                    if (size === 'M') return 'cloud';          // Medium veggies
                    if (size === 'L') return 'scallop';        // Large veggies
                    return 'scallop';                          // XL veggies
                  };
                  
                  const shapeType = getPlantShape(plant);
                  
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
                  
                  // 6-petal flower
                  if (shapeType === 'flower-6') {
                    return (
                      <g key={idx} opacity="0.9">
                        <circle cx={x} cy={y} r={radius * 0.4} fill={color} />
                        {[0, 1, 2, 3, 4, 5].map(i => {
                          const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
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
                      </g>
                    );
                  }

                  // 10-petal flower
                  if (shapeType === 'flower-10') {
                    return (
                      <g key={idx} opacity="0.9">
                        <circle cx={x} cy={y} r={radius * 0.4} fill={color} />
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
                          const angle = (i * Math.PI * 2) / 10 - Math.PI / 2;
                          return (
                            <circle
                              key={i}
                              cx={x + Math.cos(angle) * radius * 0.7}
                              cy={y + Math.sin(angle) * radius * 0.7}
                              r={radius * 0.3}
                              fill={color}
                            />
                          );
                        })}
                      </g>
                    );
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
                    const plantColors = generatePlantColors(generatedLayout);
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