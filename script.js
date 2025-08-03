// Narrative visualization parameters
let sceneIndex = 0;
const totalScenes = 4; // Overview, Toothbrushes, Beds, Families
let currentData = [];
let filteredData = [];

// Load data and initialize visualization
d3.json("data/people.json").then(data => {
  currentData = data;
  renderScene();
  updateNavigation();

  // Event listeners for navigation
  d3.select("#next").on("click", () => {
    if (sceneIndex < totalScenes - 1) {
      sceneIndex++;
      renderScene();
      updateNavigation();
    }
  });

  d3.select("#prev").on("click", () => {
    if (sceneIndex > 0) {
      sceneIndex--;
      renderScene();
      updateNavigation();
    }
  });

  d3.select("#home").on("click", () => {
    sceneIndex = 0;
    renderScene();
    updateNavigation();
  });

  d3.selectAll(".image-box")
  .on("click", function(event, d) {
    d3.select("#popup-image").attr("src", d.image);
    d3.select("#popup-country").text(`${d.country}, ${d.continent}`);
    d3.select("#popup-income").text(`Income: $${d.monthlyIncome}/month`);
    d3.select("#popup-description").text(getAnnotationText(d));

    // Show popup
    d3.select("#popup").classed("hidden", false);

    // Draw map
    drawPopupMap(d.country);
  });

  d3.select("#popup-close").on("click", () => {
    d3.select("#popup").classed("hidden", true);
  });


}).catch(error => {
  console.error("Error loading data:", error);
  d3.select("#scene-container").html("<p>Unable to load data. Please refresh the page.</p>");
});

// Update navigation state
function updateNavigation() {
  d3.select("#prev").property("disabled", sceneIndex === 0);
  d3.select("#next").property("disabled", sceneIndex === totalScenes - 1);
  d3.select("#home").property("disabled", sceneIndex === 0);
  
  // Show progress
  d3.select("#nav").select(".progress").remove();
  d3.select("#nav").append("div")
    .attr("class", "progress")
    .text(`${sceneIndex + 1} / ${totalScenes}`);
}

// Main scene renderer
function renderScene() {
  d3.select("#scene-container").html(""); // Clear previous scene
  
    if (sceneIndex === 0) {
    renderOverviewScene();
  } else if (sceneIndex === 1) {
    renderToothbrushScene();
  } else if (sceneIndex === 2) {
    renderBedsScene();
  } else if (sceneIndex === 3) {
    renderFamiliesScene();
  }
}

// Scene 0: Overview - Income distribution and introduction
function renderOverviewScene() {
  const container = d3.select("#scene-container");
  
  // Title and introduction
  container.append("h2")
    .text("Dollar Street: How Income Affects Daily Life")
    .style("color", "#2c3e50")
    .style("margin-bottom", "1em");

  container.append("p")
    .text("Explore how people's daily lives differ across income levels around the world. From dental hygiene and sleeping arrangements to family living conditions, discover how monthly income shapes everything from basic necessities to lifestyle choices across different cultures and regions.")
    .style("color", "#7f8c8d")
    .style("margin-bottom", "2em")
    .style("max-width", "800px")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("line-height", "1.6");

  // Income level summary
  const incomeSummary = container.append("div")
    .attr("class", "income-summary")
    .style("display", "flex")
    .style("justify-content", "space-around")
    .style("margin", "2em 0");

  // Low income summary (first)
  const lowIncomeData = currentData.filter(d => d.income === "low");
  
  incomeSummary.append("div")
    .attr("class", "income-card low")
    .html(`
      <h3>Low Income</h3>
      <p class="avg-income">~$29/month</p>
      <p class="count">${lowIncomeData.length} examples</p>
    `)
    .style("background", "linear-gradient(135deg, #4facfe, #00f2fe)")
    .style("color", "white")
    .style("padding", "1.5em")
    .style("border-radius", "10px")
    .style("text-align", "center")
    .style("min-width", "150px");

  // Mid income summary (second)
  const midIncomeData = currentData.filter(d => d.income === "mid");
  
  incomeSummary.append("div")
    .attr("class", "income-card mid")
    .html(`
      <h3>Mid Income</h3>
      <p class="avg-income">$500~$1,000/month</p>
      <p class="count">${midIncomeData.length} examples</p>
    `)
    .style("background", "linear-gradient(135deg, #f093fb, #f5576c)")
    .style("color", "white")
    .style("padding", "1.5em")
    .style("border-radius", "10px")
    .style("text-align", "center")
    .style("min-width", "150px");

  // High income summary (third)
  const highIncomeData = currentData.filter(d => d.income === "high");
  
  incomeSummary.append("div")
    .attr("class", "income-card high")
    .html(`
      <h3>High Income</h3>
      <p class="avg-income">~$3,000/month</p>
      <p class="count">${highIncomeData.length} examples</p>
    `)
    .style("background", "linear-gradient(135deg, #667eea, #764ba2)")
    .style("color", "white")
    .style("padding", "1.5em")
    .style("border-radius", "10px")
    .style("text-align", "center")
    .style("min-width", "150px");

  

  // Call to action
  container.append("p")
    .text("Click 'Next' to explore toothbrushes across income levels")
    .style("color", "#95a5a6")
    .style("font-style", "italic")
    .style("margin-top", "2em");
}

// Scene 1: Toothbrushes by income level
function renderToothbrushScene() {
  const container = d3.select("#scene-container");

  // Title and description
  container.append("h2")
    .text("Toothbrushes by Income Level")
    .style("color", "#2c3e50")
    .style("margin-bottom", "1em");

  container.append("p")
    .text("Dental hygiene practices and toothbrush quality vary significantly across income levels. From basic manual toothbrushes to advanced electric models, explore how income affects oral care habits and dental hygiene products around the world.")
    .style("color", "#7f8c8d")
    .style("margin-bottom", "1em")
    .style("max-width", "800px")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("line-height", "1.6");

  // Add filter UI
  addFilters(container, "toothbrush");

  // Create image grid container
  container.append("div")
    .attr("id", "toothbrush-images")
    .attr("class", "image-row");

  // Initial render
  updateToothbrushImages();
}

// Scene 2: Beds by income level
function renderBedsScene() {
  const container = d3.select("#scene-container");

  // Title and description
  container.append("h2")
    .text("Beds by Income Level")
    .style("color", "#2c3e50")
    .style("margin-bottom", "1em");

  container.append("p")
    .text("Sleeping arrangements and bedroom conditions vary significantly across income levels. From simple sleeping spaces to elaborate bedroom setups, explore how income affects where and how people sleep around the world.")
    .style("color", "#7f8c8d")
    .style("margin-bottom", "1em")
    .style("max-width", "800px")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("line-height", "1.6");

  // Add filter UI
  addFilters(container, "beds");

  // Create image grid container
  container.append("div")
    .attr("id", "beds-images")
    .attr("class", "image-row");

  // Initial render
  updateBedsImages();
}

// Scene 3: Families by income level
function renderFamiliesScene() {
  const container = d3.select("#scene-container");

  // Title and description
  container.append("h2")
    .text("Families by Income Level")
    .style("color", "#2c3e50")
    .style("margin-bottom", "1em");

  container.append("p")
    .text("Family structures and living conditions vary significantly across income levels. From nuclear families in spacious homes to extended families in compact spaces, explore how different family compositions and economic circumstances shape daily life around the world.")
    .style("color", "#7f8c8d")
    .style("margin-bottom", "1em")
    .style("max-width", "800px")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .style("line-height", "1.6");

  // Add filter UI
  addFilters(container, "families");

  // Create image grid container
  container.append("div")
    .attr("id", "families-images")
        .attr("class", "image-row");

  // Initial render
  updateFamiliesImages();
}

// Get country location coordinates for map
function getCountryLocation(country) {
  const locations = {
    "United States": { x: 25, y: 45, color: "#667eea" },
    "Brazil": { x: 40, y: 65, color: "#f093fb" },
    "Colombia": { x: 35, y: 60, color: "#f093fb" },
    "France": { x: 80, y: 35, color: "#4facfe" },
    "Spain": { x: 75, y: 40, color: "#4facfe" },
    "Czech Republic": { x: 85, y: 35, color: "#4facfe" },
    "Kenya": { x: 80, y: 55, color: "#f5576c" },
    "Burundi": { x: 80, y: 60, color: "#f5576c" },
    "Burkina Faso": { x: 75, y: 55, color: "#f5576c" },
    "India": { x: 100, y: 50, color: "#764ba2" },
    "South Korea": { x: 110, y: 40, color: "#764ba2" }
  };
  return locations[country] || { x: 100, y: 60, color: "#95a5a6" };
}

function drawPopupMap(countryName) {
  
  d3.select("#popup-map").html(""); // clear previous map

  const width = 500, height = 300;

  const svg = d3.select("#popup-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoMercator()
    .scale(90)
    .translate([width / 2, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(worldData => {
    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    const countryMap = {
      "United States": "United States of America",
      "Czech Republic": "Czechia",
      "South Korea": "South Korea"
    };

    console.log("countryName:", countryName);

    const targetName = countryMap[countryName] || countryName;
    svg.selectAll("path")
      .data(countries)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", d => (d.properties.name === targetName ? "#e74c3c" : "#ccc"))
      .attr("stroke", "#fff");

    const countryFeature = countries.find(f => f.properties.name === targetName);
    if (countryFeature) {
      const centroid = path.centroid(countryFeature);
      svg.append("circle")
        .attr("cx", centroid[0])
        .attr("cy", centroid[1])
        .attr("r", 3)
        .attr("fill", "red");
          console.log("Centroid for", targetName, centroid);
    }
  });
}

function getContinent(country) {
  const continentMap = {
    'United States': 'The Americas',
    'Brazil': 'The Americas', 
    'Colombia': 'The Americas',
    'France': 'Europe',
    'Spain': 'Europe',
    'Czech Republic': 'Europe',
    'India': 'Asia',
    'South Korea': 'Asia',
    'Kenya': 'Africa',
    'Burkina Faso': 'Africa',
    'Burundi': 'Africa'
  };
  return continentMap[country] || 'Unknown';
}

function getMonthlyIncome(country) {
  return '30';
}

// Update toothbrush images based on current filters
function updateToothbrushImages() {
  const selectedIncome = d3.select("#incomeFilter").property("value");
  const selectedCountry = d3.select("#countryFilter").property("value");

  filteredData = currentData.filter(d =>
    d.type === "toothbrush" &&
    (selectedIncome === "all" || d.income === selectedIncome) &&
    (selectedCountry === "all" || d.country === selectedCountry)
  );

  // Sort by income level: low -> mid -> high
  const incomeOrder = { low: 1, mid: 2, high: 3 };
  filteredData.sort((a, b) => incomeOrder[a.income] - incomeOrder[b.income]);

  const imageContainer = d3.select("#toothbrush-images");
  
  // Clear existing images
  imageContainer.html("");

  // Add new filtered images
  imageContainer.selectAll("div")
    .data(filteredData)
        .enter()
        .append("div")
        .attr("class", "image-box")
        .html(d => `
      <img src="${d.image}" alt="toothbrush from ${d.country}" onerror="this.style.display='none'">
      <div class="annotation">
        <div class="annotation-header">
          <p class="country"><strong>${d.country}</strong></p>
          <div class="income-label ${d.income}-income">
            ${d.income.toUpperCase()} INCOME
          </div>
        </div>
        <div class="annotation-content">
          <p class="monthly-income">$${d.monthlyIncome}/month</p>
          <div class="annotation-text">
            ${getToothbrushAnnotation(d)}
          </div>
        </div>
      </div>
      <div class="tooltip">
        <div class="tooltip-content">
          <div class="tooltip-location">${d.country}, ${d.continent}\n</div>
          <div class="tooltip-income">$${d.monthlyIncome}/month\n</div>
          <div class="tooltip-photo">${d.photoBy}</div>
        </div>
      </div>
    `)
    .on("mouseenter", function(event, d) {
      d3.select(this).select(".tooltip").style("opacity", "1");
      d3.select(this).style("transform", "scale(1.05)");
    })
    .on("mouseleave", function(event, d) {
      d3.select(this).select(".tooltip").style("opacity", "0");
      d3.select(this).style("transform", "scale(1)");
    })
    .on("click", function(event, d) {
      d3.select("#popup-image").attr("src", d.image);
      d3.select("#popup-country").text(`${d.country}, ${d.continent}`);
      d3.select("#popup-income").text(`Income: $${d.monthlyIncome}/month`);
      d3.select("#popup-description").text(`Photo by: ${d.photoBy}`);
  
      d3.select("#popup").classed("hidden", false);
      drawPopupMap(d.country);
    });
}

// Update beds images based on current filters
function updateBedsImages() {
  const selectedIncome = d3.select("#incomeFilter").property("value");
  const selectedCountry = d3.select("#countryFilter").property("value");

  filteredData = currentData.filter(d =>
    d.type === "beds" &&
    (selectedIncome === "all" || d.income === selectedIncome) &&
    (selectedCountry === "all" || d.country === selectedCountry)
  );

  // Sort by income level: low -> mid -> high
  const incomeOrder = { low: 1, mid: 2, high: 3 };
  filteredData.sort((a, b) => incomeOrder[a.income] - incomeOrder[b.income]);

  const imageContainer = d3.select("#beds-images");
  
  // Clear existing images
  imageContainer.html("");

  // Add new filtered images
  imageContainer.selectAll("div")
    .data(filteredData)
    .enter()
    .append("div")
    .attr("class", "image-box")
    .html(d => `
      <img src="${d.image}" alt="bedroom from ${d.country}" onerror="this.style.display='none'">
      <div class="annotation">
        <div class="annotation-header">
          <p class="country"><strong>${d.country}</strong></p>
          <div class="income-label ${d.income}-income">
            ${d.income.toUpperCase()} INCOME
          </div>
        </div>
        <div class="annotation-content">
          <p class="monthly-income">$${d.monthlyIncome}/month</p>
          <div class="annotation-text">
            ${getBedsAnnotation(d)}
          </div>
        </div>
      </div>
      <div class="tooltip">
        <div class="tooltip-content">
          <div class="tooltip-location">${d.country}, ${d.continent}</div>
          <div class="tooltip-income">$${d.monthlyIncome}/month</div>
          <div class="tooltip-photo">${d.photoBy}</div>
        </div>
      </div>
    `)
    .on("mouseenter", function(event, d) {
      d3.select(this).select(".tooltip").style("opacity", "1");
      d3.select(this).style("transform", "scale(1.05)");
    })
    .on("mouseleave", function(event, d) {
      d3.select(this).select(".tooltip").style("opacity", "0");
      d3.select(this).style("transform", "scale(1)");
    })
    .on("click", function(event, d) {
    d3.select("#popup-image").attr("src", d.image);
    d3.select("#popup-country").text(`${d.country}, ${d.continent}`);
    d3.select("#popup-income").text(`Income: $${d.monthlyIncome}/month`);
    d3.select("#popup-description").text(`Photo by: ${d.photoBy}`);

    d3.select("#popup").classed("hidden", false);
    drawPopupMap(d.country);
  });

}

// Update families images based on current filters
function updateFamiliesImages() {
  const selectedIncome = d3.select("#incomeFilter").property("value");
  const selectedCountry = d3.select("#countryFilter").property("value");

  // Filter data based on selections
  let filteredData = currentData.filter(d => d.type === "families");
  
  if (selectedIncome !== "all") {
    filteredData = filteredData.filter(d => d.income === selectedIncome);
  }
  
  if (selectedCountry !== "all") {
    filteredData = filteredData.filter(d => d.country === selectedCountry);
  }

  // Sort by income level: low -> mid -> high
  const incomeOrder = { low: 1, mid: 2, high: 3 };
  filteredData.sort((a, b) => incomeOrder[a.income] - incomeOrder[b.income]);

  // Clear and update image container
  const imageContainer = d3.select("#families-images");
  imageContainer.html("");



  // Create image boxes
  imageContainer.selectAll(".image-box")
    .data(filteredData)
    .enter()
    .append("div")
    .attr("class", "image-box")
    .html(d => `
      <img src="${d.image}" alt="family from ${d.country}" onerror="this.style.display='none'">
      <div class="annotation">
        <div class="annotation-header">
          <p class="country"><strong>${d.country}</strong></p>
          <div class="income-label ${d.income}-income">
            ${d.income.toUpperCase()} INCOME
          </div>
        </div>
        <div class="annotation-content">
          <p class="monthly-income">$${d.monthlyIncome}/month</p>
          <div class="annotation-text">
            ${getFamiliesAnnotation(d)}
          </div>
        </div>
      </div>
      <div class="tooltip">
        <div class="tooltip-content">
          <div class="tooltip-location">${d.country}, ${d.continent}</div>
          <div class="tooltip-income">$${d.monthlyIncome}/month</div>
          <div class="tooltip-photo">${d.photoBy}</div>
        </div>
      </div>
    `)
    .on("mouseenter", function(event, d) {
      d3.select(this).select(".tooltip").style("opacity", "1");
      d3.select(this).style("transform", "scale(1.05)");
    })
    .on("mouseleave", function(event, d) {
      d3.select(this).select(".tooltip").style("opacity", "0");
      d3.select(this).style("transform", "scale(1)");
    })
    .on("click", function(event, d) {
      // Set popup content
      d3.select("#popup-image").attr("src", d.image);
      d3.select("#popup-country").text(`${d.country}, ${d.continent}`);
      d3.select("#popup-income").text(`Income: $${d.monthlyIncome}/month`);
      d3.select("#popup-description").text(`Photo by: ${d.photoBy}`);
      
      // Show popup
      d3.select("#popup").classed("hidden", false);
  
      // Draw map
      drawPopupMap(d.country);
    });
  
    d3.select("#popup-close").on("click", () => {
    d3.select("#popup").classed("hidden", true);
  });
}

// Annotation functions
function getToothbrushAnnotation(d) {
  const annotations = {
    high: "Advanced electric toothbrushes with multiple features, high-quality manual toothbrushes, and comprehensive dental care accessories.",
    mid: "Standard manual toothbrushes with basic dental hygiene products, often in good condition with some additional care items.",
    low: "Basic manual toothbrushes, sometimes shared among family members, with minimal dental care products and simple storage."
  };
  return annotations[d.income] || "Standard dental hygiene item.";
}

function getBedsAnnotation(d) {
  const annotations = {
    high: "Comfortable beds with proper mattresses, pillows, and bedroom furniture in dedicated sleeping spaces with privacy.",
    mid: "Basic beds or sleeping arrangements with some comfort items, often in shared living spaces with moderate privacy.",
    low: "Simple sleeping arrangements, often mats or basic bedding on the floor, minimal privacy and shared sleeping areas."
  };
  return annotations[d.income] || "Standard sleeping arrangement.";
}

function getFamiliesAnnotation(d) {
  const annotations = {
    high: "Nuclear families with parents and children living in spacious homes with dedicated family areas and modern amenities.",
    mid: "Mixed family structures - nuclear families and some extended families sharing moderate living spaces with basic amenities.",
    low: "Nuclear families with parents and children living in small, cramped spaces with minimal amenities and shared living areas."
  };
  return annotations[d.income] || "Standard family living arrangement.";
}

// Filter function
function addFilters(container, type) {
  const filterBar = container.append("div")
    .attr("class", "filter-bar")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center")
    .style("gap", "1em")
    .style("margin-bottom", "2em")
    .style("padding", "1em")
    .style("background", "#f8f9fa")
    .style("border-radius", "10px")
    .style("flex-wrap", "wrap");

  // Filter label
  filterBar.append("span")
    .text("Filter by:")
    .style("font-weight", "600")
    .style("color", "#2c3e50");

  // Income filter
  const incomeFilterContainer = filterBar.append("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "0.5em");

  incomeFilterContainer.append("label")
    .text("Income Level:")
    .style("font-weight", "500")
    .style("color", "#7f8c8d");

  incomeFilterContainer.append("select")
    .attr("id", "incomeFilter")
    .style("padding", "0.5em")
    .style("border", "1px solid #ddd")
    .style("border-radius", "5px")
    .style("background", "white")
    .html(`
      <option value="all">All Income Levels</option>
      <option value="high">High Income</option>
      <option value="mid">Mid Income</option>
      <option value="low">Low Income</option>
    `);

  // Country filter
  const countries = Array.from(new Set(currentData.filter(d => d.type === type).map(d => d.country))).sort();
  const countryFilterContainer = filterBar.append("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "0.5em");

  countryFilterContainer.append("label")
    .text("Country:")
    .style("font-weight", "500")
    .style("color", "#7f8c8d");

  const countrySelect = countryFilterContainer.append("select")
    .attr("id", "countryFilter")
    .style("padding", "0.5em")
    .style("border", "1px solid #ddd")
    .style("border-radius", "5px")
    .style("background", "white");

  countrySelect.append("option")
    .attr("value", "all")
    .text("All Countries");

  countries.forEach(c => {
    countrySelect.append("option")
      .attr("value", c)
      .text(c);
  });

  // Add event listeners to update images on filter change
  d3.select("#incomeFilter").on("change", () => {
    if (type === "toothbrush") updateToothbrushImages();
    else if (type === "beds") updateBedsImages();
    else if (type === "families") updateFamiliesImages();
  });

  d3.select("#countryFilter").on("change", () => {
    if (type === "toothbrush") updateToothbrushImages();
    else if (type === "beds") updateBedsImages();
    else if (type === "families") updateFamiliesImages();
  });

  filterBar.append("p").text("Place mouse or Click on images for details").style("text-align", "center").style("color", "#7f8c8d").style("margin-bottom", "1em").style("font-style", "italic");

  function renderOverviewScene() {
    const container = d3.select("#scene-container");
  
    container.append("h2")
      .text("Income and Living Conditions Around the World")
      .style("margin-bottom", "1em");
  
    container.append("p")
      .text("This map shows some of the countries we are exploring. Their income levels differ dramatically, which impacts everyday objects like toothbrushes and beds.")
      .style("max-width", "800px")
      .style("margin", "0 auto 1.5em auto")
      .style("line-height", "1.6");
  
    // Create SVG for world map
    const width = 800;
    const height = 400;
  
    const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "0 auto 2em auto");
  
    const projection = d3.geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);
  
    const path = d3.geoPath().projection(projection);
  
    // Load and draw the world map
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(worldData => {
      const countries = topojson.feature(worldData, worldData.objects.countries).features;
  
      svg.selectAll("path")
        .data(countries)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#f0f0f0")
        .attr("stroke", "#ccc");
  
      // Color by income
      const incomeColor = {
        high: "#2ecc71",
        mid: "#f1c40f",
        low: "#e74c3c"
      };
  
      svg.selectAll("circle")
        .data(countryPoints)
        .enter()
        .append("circle")
        .attr("cx", d => projection(d.coords)[0])
        .attr("cy", d => projection(d.coords)[1])
        .attr("r", 6)
        .attr("fill", d => incomeColor[d.income])
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
  
      const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);
  
      svg.append("g")
        .call(makeAnnotations);
    });
  }
  

}
