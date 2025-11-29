---
description: Advanced SEO & Content Strategy for Tool Ranking
---

# Advanced SEO & Content Strategy Plan

This workflow outlines the strategy to upgrade all tool pages with high-quality content, targeted keywords, and technical SEO to improve Google rankings.

## 1. Tool-Specific Keyword Strategy
We will target "long-tail" and "intent-based" keywords.

### **Health Tools**
*   **BMI Calculator**:
    *   *Primary*: "BMI Calculator for Men/Women", "Calculate Body Mass Index"
    *   *Secondary*: "BMI Chart by Age", "Is my BMI healthy?", "BMI formula kg/m2"
*   **Calorie Calculator**:
    *   *Primary*: "Daily Calorie Intake Calculator", "TDEE Calculator"
    *   *Secondary*: "Calories to lose weight", "Maintenance calories calculator"
*   **Diet/Exercise Generators**:
    *   *Primary*: "Free AI Diet Plan Generator", "Custom Workout Plan Maker"
    *   *Secondary*: "Meal planner for weight loss", "Gym routine generator free"

### **Finance Tools**
*   **EMI Calculator**:
    *   *Primary*: "Home Loan EMI Calculator", "Car Loan EMI Calculator"
    *   *Secondary*: "EMI amortization schedule", "Loan interest calculator India"

### **Productivity Tools**
*   **Resume Maker**:
    *   *Primary*: "Free Resume Builder", "ATS Friendly Resume Maker"
    *   *Secondary*: "CV maker for freshers", "Resume templates free download"
*   **PDF Tools**:
    *   *Primary*: "Merge PDF online free", "Compress PDF to 100kb"
    *   *Secondary*: "Split PDF pages", "Convert JPG to PDF online"

## 2. Content Structure for Every Tool Page
Each tool page (e.g., `src/pages/bmi-calculator.astro`) must be expanded from a simple wrapper to a full content page.

**New Page Structure:**
1.  **H1 Title**: Keyword-rich (e.g., "Free BMI Calculator – Check Your Body Mass Index").
2.  **The Tool**: The interactive component (`<BMICalculator />`) at the top.
3.  **Introduction (H2)**: "What is BMI?" (100-150 words).
4.  **How to Use (H2)**: Step-by-step guide with bullets.
5.  **Understanding Results (H2)**: Explanation of the output (e.g., Underweight vs. Normal).
6.  **Benefits/Why Use Us (H2)**: Speed, privacy, accuracy.
7.  **FAQ Section (H2)**: 3-5 Schema-marked FAQs.
8.  **Related Tools**: Links to Calorie Calculator, Diet Generator.

## 3. Technical SEO Implementation
- [ ] **JSON-LD Schema**: Add `SoftwareApplication` and `FAQPage` schema to every tool page.
- [ ] **Meta Tags**: Update `title` (50-60 chars) and `description` (150-160 chars) to be catchy and keyword-heavy.
- [ ] **Open Graph**: Ensure every tool has a custom social share image.
- [ ] **Sitemap**: Verify `sitemap-index.xml` includes all new tool pages.

## 4. Execution Roadmap
1.  **Phase 1: Health Tools** (BMI, Calorie, Diet, Exercise)
    *   Update `bmi-calculator.astro` with full content.
    *   Update `calorie-calculator.astro`.
2.  **Phase 2: Finance & Career** (EMI, Resume)
    *   Update `emi-calculator.astro` (already has some content, needs SEO polish).
    *   Update `resume-maker.astro`.
3.  **Phase 3: PDF Tools**
    *   Create dedicated landing pages for each PDF tool if they don't exist, or enhance the main one.

## 5. Immediate Action Item
Start with **BMI Calculator** as the pilot.
1.  Research content.
2.  Rewrite `src/pages/bmi-calculator.astro`.
3.  Add Schema.
