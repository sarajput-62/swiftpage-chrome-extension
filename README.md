# SwiftPage – LMS Chrome Extension

## Overview
SwiftPage is an internal Chrome extension designed to support LMS FTEs and approved vendors by providing structured, rule-based recommendations when reviewing LinkedIn Company Pages.

## Scope
- Internal use only: Designed specifically for LMS FTEs and approved vendors.
- Usage Analytics: Transmits anonymized usage data (action type, recommendation title, and company metrics) to an internal database for performance auditing.
- Identity Attribution: Submits employee name and email with each log to track internal adoption and tool utility.

## Permissions
- activeTab: Used only when user triggers the extension
- scripting: Used for on-demand page evaluation
- host permissions restricted to linkedin.com

## Deployment
The extension is distributed internally via the Chrome Web Store (domain-restricted).

## Ownership
Maintained by the LMS team for internal productivity use.
``
