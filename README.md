# 🤖 AI Resume Builder

> An AI-powered resume builder that helps students and job seekers create professional, ATS-friendly resumes with the help of Google Gemini AI.

---

## 🚀 Live Demo

### 👉 [🌐 Open AI Resume Builder](https://ai-resume-builder-qltj.hatchable.site)

Try the application directly in your browser:

**https://ai-resume-builder-qltj.hatchable.site**

---

## 📌 Overview

Finding it difficult to create a professional resume that matches a job description?

**AI Resume Builder** solves this problem by combining an easy-to-use resume builder with AI-powered content optimization.

Users can enter their personal information, education, experience, skills, projects, and target job description. The application uses **Google Gemini AI** to improve resume content and tailor it toward the target role.

The application also provides a live resume preview that helps users create an **ATS-friendly resume**.

---

## ✨ Key Features

### 👤 Personal Information
- Name
- Email
- Phone number
- Location
- LinkedIn / Portfolio

### 🎯 Target Job Role
Enter the job role you are applying for to create a more targeted resume.

### 🧠 AI-Powered Resume Generation
Generate professional resume content using Google Gemini AI.

### 📝 AI Professional Summary
Generate a concise and professional career summary based on the candidate's information.

### 💼 AI Experience Enhancement
Improve existing experience descriptions and convert them into stronger, professional resume bullet points.

### 🚀 AI Project Enhancement
Improve project descriptions while preserving the candidate's original information.

### 🛠️ AI Skill Suggestions
Get relevant skill suggestions based on the candidate's profile.

### 🎯 Job Description Tailoring
Enter a target job description and receive AI-powered suggestions to better align the resume with the job.

### 📊 ATS-Friendly Resume
The application generates a clean resume structure designed to be easy for Applicant Tracking Systems (ATS) to parse.

### 👀 Live Resume Preview
See the resume update while entering information.

### 💾 Draft Saving
Resume data can be saved locally in the browser so users can continue their work later.

### 📄 PDF Output
The completed resume can be printed or saved as a PDF directly from the browser.

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │       User          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Resume Builder    │
                 │   HTML / CSS / JS   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     AI API Layer    │
                 │      /api/ai        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Google Gemini    │
                 │         AI          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ AI-Enhanced Resume  │
                 └─────────────────────┘