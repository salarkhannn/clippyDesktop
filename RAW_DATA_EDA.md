# Step 2: Exploratory Data Analysis - Raw Data

**Course:** Data Visualization  
**Project:** Economic Growth vs. Human Life Wellness  
**Hypothesis:** Economic growth is not a good indicator for human life wellness in a country/region  
**Timeline:** 1950-2022

---

## Table of Contents
- [Overview](#overview)
- [Data Sources](#data-sources)
- [Dataset Exploration](#dataset-exploration)
  - [Economic Indicators](#economic-indicators)
  - [Wellness Indicators](#wellness-indicators)
  - [Demographics & Urbanization](#demographics--urbanization)
  - [World Development Indicators (WDI)](#world-development-indicators-wdi)
- [Data Quality Assessment](#data-quality-assessment)
- [Key Findings](#key-findings)
- [Next Steps](#next-steps)

---

## Overview

This document captures the **Exploratory Data Analysis (EDA)** performed on raw datasets collected from multiple authoritative sources. The purpose of this phase was to:

1. **Understand the structure** and content of each dataset
2. **Assess data quality** including completeness, coverage, and consistency
3. **Identify relevant indicators** for economic growth and wellness analysis
4. **Determine temporal coverage** to ensure alignment with our 1950-2022 timeline
5. **Plan data integration** strategies across disparate sources

The exploration was conducted systematically using the `data-exploration.py` script, which automated dataset profiling and generated comprehensive reports.

### Visualization Notebook

All exploratory visualizations are generated in the companion Jupyter notebook:
- **Notebook:** `raw_data_eda_visualizations.ipynb`
- **Output Directory:** `visualizations/`

The visualizations provide interactive and static charts for:
- Dataset size and structure comparisons
- Missing data patterns and completeness
- Temporal coverage analysis
- Geographic coverage and country overlaps
- Indicator-specific distributions and trends

---

## Data Sources

We collected data from 12 distinct sources, categorized by their primary focus:

| **Category** | **Source** | **Provider** | **File Name** |
|-------------|-----------|--------------|---------------|
| **Economic Indicators** | Maddison GDP per Capita | Maddison Project Database | `Maddison-gdp-per-capita-maddison-project-database.csv` |
| | Maddison Population | Maddison Project Database | `Maddison-Population.csv` |
| **Wellness Indicators** | OECD Well-Being | OECD | `OECD-WellBeing.csv` |
| | WHO Suicide Rates | World Health Organization | `WHO-suicide-rate-mdb.csv` |
| **World Development** | WDI Main Data | World Bank | `WDICSV.csv` |
| | WDI Country Metadata | World Bank | `WDICountry.csv` |
| | WDI Series Metadata | World Bank | `WDISeries.csv` |
| | WDI Country-Series | World Bank | `WDIcountry-series.csv` |
| | WDI Series-Time | World Bank | `WDIseries-time.csv` |
| | WDI Footnote | World Bank | `WDIfootnote.csv` |
| **Demographics** | WPP Demographics | UN World Population Prospects | `WPP-Demographic_Indicators_MediumWPP.csv` |
| **Urbanization** | WUP Urbanization | UN World Urbanization Prospects | `WUP-Urbanization.csv` |

**Visualization:** *Dataset size and structure comparison*  
📊 See: `visualizations/01_dataset_size_comparison.html`

---

## Dataset Exploration

### Economic Indicators

#### 1. Maddison GDP per Capita

**Purpose:** Historical GDP per capita for long-term economic growth trend analysis

**Dataset Profile:**
- **Size:** 21,586 rows × 5 columns
- **Temporal Coverage:** Year 1 to 2022 (historical data)
- **Geographic Coverage:** 178 countries/entities
- **Missing Data:** 20.23% (primarily annotation field)

**Column Structure:**
| Column | Type | Description | Missing % |
|--------|------|-------------|-----------|
| Entity | Object | Country/region name | 0% |
| Code | Object | ISO country code | 1.3% |
| Year | Integer | Year of observation | 0% |
| GDP per capita | Float | GDP per capita in 2011 US$ | 0% |
| 900793-annotations | Object | Data annotations | 99.9% |

**Key Statistics:**
- **Year Range:** 1 to 2022
- **GDP per Capita Range:** $295 to $160,051
- **Median GDP per Capita:** $2,618 (1957)
- **Mean GDP per Capita:** $6,870

**Data Quality Observations:**
- ✅ Excellent coverage for target period (1950-2022)
- ✅ Minimal missing values in key columns
- ⚠️ Annotation field mostly empty but not critical
- ⚠️ Some entities lack ISO codes (regions/historical entities)

**Sample Data:**
```
Entity       Code  Year  GDP per capita
Afghanistan  AFG   1950  1156.0
Afghanistan  AFG   1951  1170.0
Afghanistan  AFG   1952  1189.0
```

**Visualization:** *GDP per capita distribution and trends (1950-2022)*  
📊 See: `visualizations/09_gdp_distribution_trends.html`

---

#### 2. Maddison Population

**Purpose:** Population context for per-capita calculations and demographic weighting

**Dataset Profile:**
- **Size:** 195 rows × 303 columns
- **Temporal Coverage:** 1800-2100 (includes projections)
- **Geographic Coverage:** 195 countries
- **Missing Data:** 0.17% (minimal, mainly recent projections)

**Column Structure:**
- **Identifier Columns:** `geo` (country code), `name` (country name)
- **Year Columns:** 301 columns spanning 1800-2100 (each year is a column)

**Key Statistics:**
- **Population Range:** 905 to 1.7 billion (per country)
- **Median Population (2022):** ~10.9 million
- **Data Format:** Wide format (years as columns)

**Data Quality Observations:**
- ✅ Very complete dataset (99.83% complete)
- ✅ Excellent coverage for our target period
- ✅ Includes future projections through 2100
- ⚠️ Wide format requires transformation for analysis
- ⚠️ Some small countries may have estimated historical data

**Sample Data:**
```
geo  name         1950      1951      1952      2022
AFG  Afghanistan  8289705   8454301   8588335   41454761
AGO  Angola       4706359   4766717   4832764   35635029
ALB  Albania      1224875   1247851   1276366   2811655
```

---

### Wellness Indicators

#### 3. OECD Well-Being

**Purpose:** Multi-dimensional wellness indicators for developed countries

**Dataset Profile:**
- **Size:** 109,706 rows × 30 columns
- **Temporal Coverage:** Varies by indicator (typically 2000s onwards)
- **Geographic Coverage:** OECD member countries + partners
- **Missing Data:** 13.28%

**Indicator Categories:**
The OECD Better Life Index includes multiple dimensions:
- Life satisfaction
- Work-life balance
- Health status
- Education and skills
- Social connections
- Civic engagement
- Environmental quality
- Personal security
- Housing conditions
- Income and wealth

**Column Structure:**
| Column Type | Description | Count |
|------------|-------------|-------|
| Identifiers | Country, indicator codes | 3 |
| Metadata | Indicator names, units | 5 |
| Time | Year or period | 1 |
| Values | Indicator values | 5 |
| Flags | Data quality flags | 4 |
| Other | Various metadata | 12 |

**Key Statistics:**
- **Number of Indicators:** ~100+ unique well-being measures
- **Countries Covered:** 38 OECD members + 5 partners
- **Year Range:** Primarily 2005-2022

**Data Quality Observations:**
- ✅ High-quality, standardized indicators
- ✅ Rich multi-dimensional wellness data
- ⚠️ Limited to developed/OECD countries
- ⚠️ Shorter time series (post-2000)
- ⚠️ Different indicators have different temporal coverage
- ❌ Not comprehensive for developing countries

**Relevance to Hypothesis:**
- Perfect for "High-Inequality West" country group
- Ideal for "Nordic/Low-Inequality" control group
- Limited use for "Rapidly Industrializing" or "Developing" groups

---

#### 4. WHO Suicide Rates

**Purpose:** Mental health crisis indicator and proxy for societal stress

**Dataset Profile:**
- **Size:** 4,822 rows × 4 columns
- **Temporal Coverage:** 2000-2019
- **Geographic Coverage:** Global (multiple countries)
- **Missing Data:** 0% (complete dataset)

**Column Structure:**
| Column | Type | Description |
|--------|------|-------------|
| Entity | Object | Country name |
| Code | Object | ISO country code |
| Year | Integer | Year of observation |
| Suicide rate | Float | Deaths per 100,000 population |

**Key Statistics:**
- **Rate Range:** 0 to ~40 per 100,000
- **Median Rate:** ~10 per 100,000
- **Age Groups:** Often disaggregated by age/sex

**Data Quality Observations:**
- ✅ Complete data (no missing values)
- ✅ Standardized rates (per 100,000)
- ⚠️ Limited temporal coverage (2000-2019)
- ⚠️ Some countries may have reporting gaps
- ⚠️ Cultural and definitional differences in reporting

**Relevance to Hypothesis:**
- Critical indicator of mental health/societal wellness
- Complements economic indicators
- Relevant across all country groups
- Shows mental health crisis trends

---

### Demographics & Urbanization

#### 5. WPP Demographics

**Purpose:** Comprehensive demographic indicators including life expectancy, fertility, aging

**Dataset Profile:**
- **Size:** 84,360 rows × 67 columns
- **Temporal Coverage:** 1950-2100 (includes projections)
- **Geographic Coverage:** All countries and regions
- **Missing Data:** 7.36%

**Key Indicators:**
- Population by age and sex
- Life expectancy at birth
- Fertility rates (TFR)
- Mortality rates
- Dependency ratios
- Migration estimates
- Population growth rates

**Column Structure:**
- Location identifiers (ISO codes, names, regions)
- Variant (Medium, High, Low projections)
- Time period identifiers
- Demographic indicators (numeric values)
- Age group breakdowns

**Key Statistics:**
- **Life Expectancy Range:** 25-85 years
- **Total Fertility Rate Range:** 0.8-7.5 children per woman
- **Projection Scenarios:** Medium, High, Low variants

**Data Quality Observations:**
- ✅ Comprehensive global coverage
- ✅ Perfect alignment with project timeline (1950-2022)
- ✅ UN standard demographic indicators
- ✅ Multiple projection scenarios available
- ⚠️ Some historical data estimated for certain countries
- ⚠️ 7.36% missing data (mainly in specific subgroups)

**Relevance to Hypothesis:**
- Life expectancy: Key wellness indicator
- Dependency ratios: Economic stress measure
- Aging indicators: Societal burden metrics
- Essential for all country group analyses

---

#### 6. WUP Urbanization

**Purpose:** Urbanization trends and city-level development patterns

**Dataset Profile:**
- **Size:** 260,176 rows × 34 columns
- **Temporal Coverage:** 1950-2050 (includes projections)
- **Geographic Coverage:** Global, with city-level detail
- **Missing Data:** 14.45%

**Key Indicators:**
- Urban/rural population distribution
- City population and density
- Built-up area metrics
- Urbanization rates
- Urban agglomeration data
- Settlement categories

**Settlement Categories:**
- Very dispersed rural area
- Dispersed rural area
- Village
- Suburban/peri-urban area
- Semi-dense towns
- Dense town
- City

**Column Structure:**
| Column Type | Examples | Description |
|------------|----------|-------------|
| Location | Location, ISO codes | Geographic identifiers |
| Settlement | Category, LocType | Urban/rural classification |
| Time | Year, TimeMid | Temporal identifiers |
| Population | Pop_1Jan, Pop | Population counts |
| Area | AREA_km2, BU_km2 | Land and built-up area |
| Density | BU_m2_per_capita | Built environment metrics |
| Percentages | percPop, percBU | Share of totals |
| Rates | Pop_rate, BU_km2_rate | Growth rates |

**Key Statistics:**
- **Year Range:** 1950-2050
- **Urban Population Share:** 0-100%
- **Built-up Area Growth:** Highly variable by region
- **Number of Locations:** 321 (countries and aggregates)

**Data Quality Observations:**
- ✅ Excellent temporal alignment (1950-2050)
- ✅ Detailed city-level granularity
- ✅ Standardized settlement categories
- ⚠️ 14.45% missing data (mainly built-up area metrics)
- ⚠️ Some historical urban data estimated
- ⚠️ Complex structure requires careful processing

**Relevance to Hypothesis:**
- **Speed of urbanization** = cultural disruption proxy
- **Rapid Asia group:** Hyper-fast urbanization effects
- **Western countries:** Gradual vs. rapid patterns
- **Developing countries:** Basic infrastructure impact
- Urban density correlates with lifestyle changes

---

### World Development Indicators (WDI)

The World Bank's World Development Indicators (WDI) is our most comprehensive data source, consisting of multiple interconnected datasets.

#### 7. WDI Main Data

**Purpose:** Core dataset with 1,516 development indicators across all countries

**Dataset Profile:**
- **Size:** 403,256 rows × 69 columns
- **Temporal Coverage:** 1960-2023 (varies by indicator)
- **Geographic Coverage:** 265 countries and aggregates
- **Missing Data:** 62.00% (high due to indicator-specific availability)

**Data Structure:**
- **Long format:** Each row is one country-indicator-year combination
- **Columns:** Country Name, Country Code, Indicator Name, Indicator Code, Years 1960-2023, plus metadata

**Indicator Categories:**
1. **Economic Growth**
   - GDP, GNI, GNI per capita
   - GDP growth rates
   - Household expenditure
   - Investment and capital formation

2. **Infrastructure**
   - Access to electricity
   - Clean water and sanitation
   - Internet and telecommunications
   - Transportation networks

3. **Education**
   - Enrollment rates (primary, secondary, tertiary)
   - Literacy rates
   - Education expenditure
   - Completion rates

4. **Health**
   - Life expectancy
   - Maternal and child mortality
   - Disease prevalence
   - Health expenditure
   - Immunization rates

5. **Social Development**
   - Poverty rates
   - Inequality (Gini coefficient)
   - Employment statistics
   - Social protection coverage

6. **Environment**
   - CO2 emissions
   - Energy use
   - Forest area
   - Natural resource depletion

7. **Governance**
   - Government expenditure
   - Tax revenue
   - Institutional quality indicators

**Key Statistics:**
- **Number of Indicators:** 1,516 unique measures
- **Countries:** 265 (countries + regional aggregates)
- **Years with Data:** 1960-2023 (64 years)
- **Total Possible Observations:** ~25 million
- **Actual Observations:** ~9.5 million (62% missing)

**Data Quality Observations:**
- ✅ Most comprehensive development database
- ✅ Covers our full timeline (1950-2022)
- ✅ Standardized methodology across countries
- ✅ Regular updates and revisions
- ⚠️ High missing data rate (62%) - expected for global dataset
- ⚠️ 1950-1960 coverage limited for many indicators
- ⚠️ Different indicators have different start dates
- ⚠️ Some indicators discontinued or renamed over time

**Sample Indicators Relevant to Project:**
```
Economic Growth:
- NY.GDP.PCAP.KD: GDP per capita (constant 2015 US$)
- NY.GNP.PCAP.CD: GNI per capita (current US$)
- NE.CON.PETC.ZS: Household consumption (% of GDP)

Wellness Proxies:
- SP.DYN.LE00.IN: Life expectancy at birth
- SH.STA.SUIC.P5: Suicide mortality rate
- SE.ADT.LITR.ZS: Literacy rate
- SH.XPD.CHEX.PC.CD: Health expenditure per capita

Infrastructure:
- EG.ELC.ACCS.ZS: Access to electricity (% of population)
- SH.H2O.SMDW.ZS: Access to safe drinking water
- IT.NET.USER.ZS: Internet users (% of population)

Social:
- SI.POV.GINI: Gini index (inequality)
- SI.POV.DDAY: Poverty headcount ratio at $2.15/day
- SL.UEM.TOTL.ZS: Unemployment rate
```

---

#### 8. WDI Country Metadata

**Purpose:** Country classifications, income groups, and regional groupings

**Dataset Profile:**
- **Size:** 265 rows × 31 columns
- **Coverage:** All countries + regional aggregates
- **Missing Data:** 35.64%

**Key Information:**
- Country codes (ISO 2-digit, ISO 3-digit, numeric)
- Income group classifications (Low, Lower-middle, Upper-middle, High)
- Regional groupings (World Bank regions)
- Currency units and special notes
- Alternative country names
- Latest population census information
- National accounts reference years
- System of National Accounts (SNA) version

**Income Group Classifications:**
- **High income:** GNI per capita > $13,845
- **Upper middle income:** $4,466 - $13,845
- **Lower middle income:** $1,136 - $4,465
- **Low income:** < $1,136

**Regional Classifications:**
- East Asia & Pacific
- Europe & Central Asia
- Latin America & Caribbean
- Middle East & North Africa
- North America
- South Asia
- Sub-Saharan Africa

**Data Quality Observations:**
- ✅ Essential for country grouping strategy
- ✅ Official World Bank classifications
- ✅ Enables regional comparisons
- ⚠️ 35.64% missing data (mainly in optional fields)
- ⚠️ Income classifications change over time
- ⚠️ Some countries have incomplete metadata

**Relevance to Project:**
- **Critical for defining country groups:**
  - High-Inequality West: High-income, Western countries
  - Nordic: High-income, low inequality European countries
  - Rapidly Industrializing: East Asia, upper-middle income
  - Developing: Low/lower-middle income

---

#### 9. WDI Series Metadata

**Purpose:** Detailed descriptions and methodology for each of 1,516 indicators

**Dataset Profile:**
- **Size:** 1,516 rows × 20 columns
- **Coverage:** All WDI indicators
- **Missing Data:** 39.52%

**Key Information for Each Indicator:**
- **Series Code:** Unique identifier (e.g., NY.GDP.PCAP.KD)
- **Indicator Name:** Full descriptive name
- **Long Definition:** Detailed methodology
- **Unit of Measure:** Measurement units
- **Periodicity:** Annual, quarterly, etc.
- **Base Period:** Reference year for constant prices
- **Source:** Original data provider
- **Topic:** Development theme category
- **Statistical Concept:** Measurement framework
- **Development Relevance:** Why indicator matters

**Topic Categories:**
1. Agriculture & Rural Development
2. Aid Effectiveness
3. Climate Change
4. Economy & Growth
5. Education
6. Energy & Mining
7. Environment
8. Financial Sector
9. Gender
10. Health
11. Infrastructure
12. Poverty
13. Private Sector & Trade
14. Public Sector
15. Science & Technology
16. Social Development
17. Social Protection & Labor
18. Urban Development

**Data Quality Observations:**
- ✅ Comprehensive metadata for each indicator
- ✅ Essential for understanding indicator meanings
- ✅ Includes methodology and limitations
- ⚠️ 39.52% missing data (mainly optional fields)
- ⚠️ Some definitions complex and technical
- ⚠️ Need to cross-reference source documentation

**Relevance to Project:**
- **Essential for:**
  - Understanding what each indicator measures
  - Selecting appropriate indicators for analysis
  - Documenting methodology in final report
  - Interpreting results correctly
  - Citing data sources properly

---

#### 10. WDI Country-Series

**Purpose:** Tracks which indicators are available for which countries

**Dataset Profile:**
- **Size:** 7,939 rows × 3 columns
- **Missing Data:** 0% (complete)

**Column Structure:**
| Column | Description |
|--------|-------------|
| CountryCode | ISO 3-letter country code |
| SeriesCode | WDI indicator code |
| Description | Notes about data availability or quality |

**Data Quality Observations:**
- ✅ Complete dataset
- ✅ Helps identify data availability gaps
- ✅ Useful for planning analysis strategy
- ⚠️ Doesn't indicate temporal coverage

**Use Cases:**
- Check which countries have which indicators
- Identify gaps before analysis
- Plan indicator selection strategy
- Understand country-specific data limitations

---

#### 11. WDI Series-Time

**Purpose:** Tracks temporal coverage for each indicator

**Dataset Profile:**
- **Size:** 142 rows × 3 columns
- **Missing Data:** 0% (complete)

**Column Structure:**
| Column | Description |
|--------|-------------|
| SeriesCode | WDI indicator code |
| Year | Year of observation |
| Description | Notes about that year's data |

**Data Quality Observations:**
- ✅ Complete dataset
- ✅ Identifies temporal coverage patterns
- ⚠️ Limited to special cases/notes
- ⚠️ Not comprehensive for all indicators

---

#### 12. WDI Footnote

**Purpose:** Country-year-indicator specific notes and data quality flags

**Dataset Profile:**
- **Size:** 850,038 rows × 4 columns
- **Missing Data:** 0% (complete)

**Column Structure:**
| Column | Description |
|--------|-------------|
| CountryCode | ISO 3-letter country code |
| SeriesCode | WDI indicator code |
| Year | Year of observation |
| Description | Data quality note or footnote |

**Types of Notes:**
- Methodology changes
- Break in series
- Data source changes
- Estimated values
- Provisional data
- Coverage limitations

**Data Quality Observations:**
- ✅ Complete footnote data
- ✅ Critical for understanding data quirks
- ✅ Helps assess reliability
- ⚠️ Large volume requires filtering
- ⚠️ Some notes technical/cryptic

**Relevance to Project:**
- **Important for:**
  - Identifying breaks in time series
  - Understanding data limitations
  - Making informed decisions about indicator use
  - Documenting data quality in report

---

## Data Quality Assessment

### Overall Dataset Quality Summary

| Dataset | Size | Coverage 1950-2022 | Missing % | Quality Rating | Priority |
|---------|------|-------------------|-----------|----------------|----------|
| Maddison GDP | 21.6K rows | ✅ Excellent | 20% | ⭐⭐⭐⭐⭐ | HIGH |
| Maddison Pop | 195 rows | ✅ Excellent | 0.2% | ⭐⭐⭐⭐⭐ | HIGH |
| OECD Wellbeing | 109.7K rows | ⚠️ 2000+ only | 13% | ⭐⭐⭐⭐ | MEDIUM |
| WHO Suicide | 4.8K rows | ⚠️ 2000-2019 | 0% | ⭐⭐⭐⭐ | MEDIUM |
| WDI Main | 403.3K rows | ⚠️ 1960+ (some gaps) | 62% | ⭐⭐⭐⭐ | HIGH |
| WDI Country | 265 rows | N/A | 36% | ⭐⭐⭐⭐⭐ | HIGH |
| WDI Series | 1.5K rows | N/A | 40% | ⭐⭐⭐⭐ | HIGH |
| WDI Country-Series | 7.9K rows | N/A | 0% | ⭐⭐⭐⭐⭐ | MEDIUM |
| WDI Series-Time | 142 rows | N/A | 0% | ⭐⭐⭐⭐ | LOW |
| WDI Footnote | 850K rows | N/A | 0% | ⭐⭐⭐⭐ | LOW |
| WPP Demographics | 84.4K rows | ✅ Excellent | 7% | ⭐⭐⭐⭐⭐ | HIGH |
| WUP Urbanization | 260.2K rows | ✅ Excellent | 14% | ⭐⭐⭐⭐ | HIGH |

**Visualizations:**  
📊 *Missing data patterns*: `visualizations/02_missing_data_analysis.png`  
📊 *Data completeness comparison*: `visualizations/03_data_completeness.html`

### Strengths

1. **Comprehensive Coverage**
   - Multiple authoritative sources
   - Economic, social, health, environmental indicators
   - Global coverage with country-level detail

2. **Temporal Alignment**
   - Most datasets cover our target 1950-2022 period
   - Historical depth for trend analysis
   - Projections available for context

3. **Standardization**
   - ISO country codes across datasets
   - Common year formats
   - Standardized measurement units

4. **Documentation**
   - Extensive metadata available
   - Clear indicator definitions
   - Data quality flags and footnotes

### Challenges

1. **Missing Data**
   - WDI Main Data: 62% missing (indicator-year-country combinations)
   - Early years (1950-1960) have limited coverage
   - Some indicators start after 1960

2. **Temporal Coverage Gaps**
   - OECD data primarily post-2000
   - WHO suicide data: 2000-2019 only
   - Different indicators have different start/end dates

3. **Data Format Inconsistencies**
   - Maddison Population: Wide format (years as columns)
   - WDI: Long format (one row per observation)
   - Different date representations across datasets

4. **Country Name/Code Variations**
   - Some datasets use different country codes
   - Historical country names (e.g., USSR, Yugoslavia)
   - Regional aggregates vs. individual countries

5. **Indicator Selection Complexity**
   - 1,516 WDI indicators to choose from
   - Need domain knowledge for appropriate selection
   - Some indicators highly correlated

**Visualization:** *WDI indicator distribution by topic*  
📊 See: `visualizations/08_wdi_indicator_topics.html`

### Data Availability by Country Group

| Country Group | Economic Data | Wellness Data | Demographics | Urbanization |
|--------------|---------------|---------------|--------------|--------------|
| **High-Inequality West** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Nordic (Control)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Rapidly Industrializing** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Developing Countries** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Key Findings

### 1. Economic Indicators (Phase 1 - Material Progress)

**Available Data:**
- ✅ **Maddison GDP per Capita:** Comprehensive historical GDP data from 1 AD to 2022
- ✅ **Maddison Population:** Essential for per-capita calculations and weighting
- ✅ **WDI Economic Indicators:** 
  - GDP, GNI, consumption patterns
  - Investment and savings rates
  - Infrastructure development
  - Trade and globalization metrics

**Strengths:**
- Long historical time series for trend analysis
- Standardized purchasing power parity (PPP) adjustments
- Consistent methodology across countries
- Excellent coverage for developed countries

**Limitations:**
- Early data (1950s) may be estimated for some countries
- Some developing countries have gaps in 1950-1970 period
- Household expenditure data limited before 1960

### 2. Wellness Indicators (Phase 2 - Wellness Disconnect)

**Available Data:**
- ✅ **OECD Well-Being:** Life satisfaction, work-life balance (developed countries only)
- ✅ **WHO Suicide Rates:** Mental health crisis indicator (2000-2019)
- ✅ **WDI Health:** Life expectancy, mortality rates
- ✅ **WDI Education:** Literacy, enrollment rates
- ⚠️ **WDI Social:** Inequality (Gini), poverty rates (limited historical coverage)

**Strengths:**
- Multi-dimensional wellness measurement
- Standardized health and education indicators
- Mental health proxy data available
- Good coverage for OECD countries

**Limitations:**
- **Critical Gap:** OECD well-being data only from ~2005
  - Cannot track wellness trends from 1950
  - Limited to developed countries
  - Affects ability to show long-term wellness stagnation
- WHO suicide data limited to 2000-2019
- Gini coefficient data sporadic before 1990
- Happiness/satisfaction data largely absent before 2000

**Implications for Hypothesis:**
- Will need to use **proxy indicators** for earlier periods:
  - Life expectancy as wellness proxy
  - Health expenditure trends
  - Education outcomes
  - Suicide rates (where available)
- Focus Phase 2 analysis on post-2000 for direct wellness measures
- Use demographic stress indicators for 1950-2000 period

### 3. Demographic Stress Indicators

**Available Data:**
- ✅ **WPP Demographics:** 
  - Life expectancy, fertility, mortality (1950-2022) ⭐ Excellent
  - Aging indicators (dependency ratios)
  - Migration patterns
- ✅ **WUP Urbanization:**
  - Urban/rural population (1950-2022) ⭐ Excellent
  - Urbanization rates (speed of change)
  - City-level data for agglomeration analysis

**Strengths:**
- **Perfect temporal alignment** with project timeline
- Comprehensive global coverage
- UN standard methodology
- Can track rapid changes in Asia vs. gradual changes in West

**Value for Hypothesis:**
- **Urbanization speed** = Cultural disruption proxy
  - Rapid Asia: Hyper-fast urbanization
  - West: Gradual, managed urbanization
- **Dependency ratios** = Economic stress measure
  - Aging populations in developed countries
  - Youth bulge in developing countries
- **Life expectancy** = Wellness proxy for full timeline

**Visualization:** *Urbanization trends across countries*  
📊 See: `visualizations/10_urbanization_trends.html`

### 4. Infrastructure and Development Proxies

**Available Data:**
- ✅ **WDI Infrastructure:**
  - Access to electricity (1960+)
  - Clean water and sanitation (1960+)
  - Telecommunications (1970+)
  - Internet access (1990+)

**Relevance:**
- Demonstrates "initial ascent" for developing countries
- Shows when basic needs are met
- Supports hypothesis about basic needs vs. excess wealth

### 5. Data Availability Patterns

**By Time Period:**
| Period | Economic | Wellness | Demographics | Infrastructure |
|--------|----------|----------|--------------|----------------|
| 1950-1960 | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 1960-1990 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 1990-2000 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 2000-2022 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Visualizations:**  
📊 *Temporal coverage timeline*: `visualizations/04_temporal_coverage.html`  
📊 *Data availability heatmap*: `visualizations/05_temporal_availability_heatmap.png`

**Insight:** Analysis strategy should be **two-phased:**
- **1950-2000:** Focus on economic growth + demographic proxies for wellness
- **2000-2022:** Full analysis with direct wellness indicators

### 6. Country Group Feasibility

**High-Inequality West (US, UK, Australia, Canada):**
- ✅ Excellent data availability across all categories
- ✅ Full timeline coverage
- ✅ Best for demonstrating long-term hypothesis

**Nordic Countries (Norway, Sweden, Denmark, Finland):**
- ✅ Excellent data availability
- ✅ Strong wellness indicators
- ✅ Perfect control group

**Rapidly Industrializing (South Korea, Singapore, China):**
- ⭐⭐⭐⭐ Good economic and demographic data
- ⭐⭐⭐ Limited OECD wellness data
- ✅ Excellent urbanization data for rapid change analysis
- ⚠️ China data quality concerns for some indicators pre-1990

**Developing Countries (Various):**
- ⭐⭐⭐ Variable data quality
- ⚠️ 1950s data often estimated
- ✅ Good for "initial ascent" analysis
- ⚠️ Limited wellness indicators

**Visualizations:**  
📊 *Geographic coverage comparison*: `visualizations/06_geographic_coverage.html`  
📊 *Country overlap matrix*: `visualizations/07_country_overlap_matrix.png`

---

## Next Steps

### Immediate Actions (Data Cleaning - Step 3)

1. **Standardize Country Names/Codes**
   - Create master country mapping table
   - Handle historical country name changes
   - Standardize to ISO 3-letter codes
   - Map regional aggregates

2. **Define Final Country Groups**
   - **High-Inequality West:** USA, UK, Australia, Canada, New Zealand
   - **Nordic/Control:** Norway, Sweden, Denmark, Finland, Iceland
   - **Rapidly Industrializing:** South Korea, Singapore, China, Taiwan
   - **Developing:** Select countries with adequate data coverage

3. **Filter Timeline**
   - Focus on **1950-2022** for analysis
   - Identify indicators with insufficient pre-1960 data
   - Plan two-phase analysis approach:
     - Phase A: 1950-2000 (economic + demographic proxies)
     - Phase B: 2000-2022 (full economic + wellness indicators)

4. **Indicator Selection**
   - **Economic Growth (Phase 1):**
     - GDP per capita (Maddison/WDI)
     - GNI per capita
     - Household consumption
     - Urbanization rate
     - Infrastructure access
   
   - **Wellness Indicators (Phase 2):**
     - **1950-2000 Proxies:**
       - Life expectancy
       - Infant mortality rate
       - Education enrollment
       - Urbanization speed (cultural disruption)
     - **2000-2022 Direct Measures:**
       - OECD life satisfaction
       - WHO suicide rates
       - Gini coefficient
       - Work-life balance
       - Health outcomes

   - **Demographic Stress:**
     - Dependency ratios (youth/old-age)
     - Urban population share
     - Urbanization growth rate
     - Population growth rate

5. **Data Quality Checks**
   - Verify indicator availability for each country group
   - Identify and document data gaps
   - Plan interpolation/estimation strategies for minor gaps
   - Flag countries with insufficient data for exclusion

### Analysis Strategy Refinements

Based on EDA findings, we will:

1. **Adapt Timeline Expectations:**
   - Accept that direct wellness measurement primarily starts ~2000
   - Use demographic and health proxies for 1950-2000
   - Focus strongest hypothesis validation on 2000-2022 period

2. **Adjust Country Group Emphasis:**
   - Heavily feature High-Inequality West (best data)
   - Use Nordic countries as strong control
   - Be selective with Rapidly Industrializing (data quality varies)
   - Choose developing countries carefully based on data availability

3. **Plan Indicator Categorization:**
   - **Economic Growth Category:** Aggregate multiple economic indicators
   - **Wellness Categories:**
     - Demographics
     - Education
     - Health
     - Environment
     - Social/Inequality
     - Living Conditions
   - Later apply PCA to reduce dimensions (Step 11)

4. **Prepare for Data Integration:**
   - Merge strategies for wide vs. long format data
   - Handle missing data systematically
   - Ensure consistent temporal granularity (annual data)
   - Plan for multiple data source integration

### Documentation Requirements

1. **Create Data Dictionary:**
   - List all indicators to be used
   - Include definitions, sources, units
   - Document methodology and limitations

2. **Maintain Data Lineage:**
   - Track transformations from raw to clean data
   - Document all assumptions and estimations
   - Record data quality issues and resolutions

3. **Prepare Metadata:**
   - Country group definitions and rationale
   - Indicator selection justifications
   - Time period decisions and reasoning
   - Data gap documentation

---

## Conclusion

This exploratory data analysis phase successfully:

✅ **Identified** 12 high-quality data sources from authoritative providers  
✅ **Profiled** 403,256+ rows of WDI data plus specialized datasets  
✅ **Assessed** temporal coverage across our 1950-2022 timeline  
✅ **Evaluated** data quality and identified gaps  
✅ **Confirmed** feasibility of hypothesis testing with available data  
✅ **Planned** two-phase analysis approach to handle data limitations  

**Key Insights:**
- Economic indicators have excellent coverage throughout 1950-2022
- Direct wellness indicators primarily available post-2000
- Demographic and health proxies can extend wellness analysis to 1950
- Data quality supports strong analysis for High-Inequality West and Nordic groups
- Urbanization data enables unique cultural disruption analysis
- WDI provides breadth; specialized datasets provide depth

**Next Phase:** Data Cleaning and Processing (Step 3)
- Implement standardization and filtering plans
- Prepare integrated datasets for analysis
- Begin indicator selection and categorization
- Document all transformations

---

## Appendix: Analysis Scripts

### A. Data Exploration Script

The analysis was conducted using `data-exploration.py`:

**Key Functions:**
```python
def explore_dataset(filepath, name):
    """
    Comprehensive exploration of a single dataset
    Returns: pandas DataFrame
    """
    # Loads dataset
    # Profiles structure (rows, columns, types)
    # Analyzes missing data patterns
    # Examines categorical and numeric distributions
    # Displays sample rows
```

**Output Files:**
- `raw_data_eda_complete.txt`: Full exploration report (generated)
- `raw_data_eda_output.txt`: Original exploration output (incomplete)

### B. Dataset File Manifest

**Location:** `/home/salar/DV-Project/datasets/`

**Files:**
```
Maddison-gdp-per-capita-maddison-project-database.csv
Maddison-Population.csv
OECD-WellBeing.csv
WHO-suicide-rate-mdb.csv
WDICSV.csv
WDICountry.csv
WDISeries.csv
WDIcountry-series.csv
WDIseries-time.csv
WDIfootnote.csv
WPP-Demographic_Indicators_MediumWPP.csv
WUP-Urbanization.csv
```

**Total Raw Data Size:** ~500+ MB

### C. Visualization Files

**Notebook:** `raw_data_eda_visualizations.ipynb`  
**Output Directory:** `visualizations/`

**Generated Visualizations:**

1. **Dataset Overview:**
   - `01_dataset_size_comparison.html` - Interactive comparison of dataset dimensions
   - `02_missing_data_analysis.png` - Missing data patterns across key datasets
   - `03_data_completeness.html` - Data completeness bar chart

2. **Temporal Analysis:**
   - `04_temporal_coverage.html` - Timeline showing data availability by year
   - `05_temporal_availability_heatmap.png` - Coverage heatmap by time period

3. **Geographic Analysis:**
   - `06_geographic_coverage.html` - Country coverage comparison
   - `07_country_overlap_matrix.png` - Country overlap between datasets

4. **Indicator Analysis:**
   - `08_wdi_indicator_topics.html` - WDI indicator distribution by topic
   - `09_gdp_distribution_trends.html` - GDP per capita distribution and trends
   - `10_urbanization_trends.html` - Urbanization trends across countries

5. **Summary Statistics:**
   - `dataset_summary_statistics.csv` - Comprehensive dataset metrics

**Usage:** Run the Jupyter notebook to regenerate all visualizations with updated data.

---

## References

1. **Maddison Project Database:** https://www.rug.nl/ggdc/historicaldevelopment/maddison/
2. **OECD Better Life Index:** https://www.oecd.org/wise/better-life-index/
3. **WHO Mental Health:** https://www.who.int/data/gho/data/themes/mental-health
4. **World Bank WDI:** https://datatopics.worldbank.org/world-development-indicators/
5. **UN World Population Prospects:** https://population.un.org/wpp/
6. **UN World Urbanization Prospects:** https://population.un.org/wup/

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Author:** DV Project Team  
**Status:** Complete - Ready for Data Cleaning Phase
