/**
 * API Documentation Page
 *
 * Interactive Swagger UI for exploring the Analytics API endpoints.
 * Connects to the live backend Swagger endpoint for real-time API documentation.
 */

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { FileCode2, ExternalLink, Server, CheckCircle2 } from 'lucide-react';

const APIDocumentation: React.FC = () => {
  // Remove /api suffix from VITE_API_URL if present, as Swagger is served at root level
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const API_BASE_URL = apiUrl.replace('/api', '');
  const SWAGGER_JSON_URL = `${API_BASE_URL}/api-docs.json`;

  return (
    <div className="min-h-screen bg-css-grey-light p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-neumorphic p-8 border border-css-grey-medium/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-gold rounded-xl shadow-gold">
                <FileCode2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-montserrat font-bold text-css-navy mb-2">
                  Analytics API Documentation
                </h1>
                <p className="text-css-grey-dark">
                  Interactive API reference for the Cultural Staffing Solutions Analytics System
                </p>
              </div>
            </div>
            <a
              href={SWAGGER_JSON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-css-gold text-white rounded-lg hover:bg-css-gold/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Download OpenAPI Spec
            </a>
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-css-grey-light/50 rounded-lg">
              <p className="text-sm text-css-grey-dark mb-1">API Version</p>
              <p className="text-lg font-semibold text-css-navy">1.0.0</p>
            </div>
            <div className="p-4 bg-css-grey-light/50 rounded-lg">
              <p className="text-sm text-css-grey-dark mb-1">Base URL</p>
              <p className="text-sm font-mono text-css-navy break-all">
                {API_BASE_URL}
              </p>
            </div>
            <div className="p-4 bg-css-grey-light/50 rounded-lg">
              <p className="text-sm text-css-grey-dark mb-1">Authentication</p>
              <p className="text-lg font-semibold text-css-navy">Session Cookies</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Status
              </p>
              <p className="text-lg font-semibold text-green-800">Live API</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6">
            <p className="text-sm text-css-grey-dark mb-3 font-semibold">Quick Navigation:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#/Analytics%20-%20Dashboard"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Dashboard
              </a>
              <a
                href="#/Analytics%20-%20Performance"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Performance
              </a>
              <a
                href="#/Analytics%20-%20Skills"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Skills
              </a>
              <a
                href="#/Analytics%20-%20Training"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Training
              </a>
              <a
                href="#/Analytics%20-%20Sentiment"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Sentiment
              </a>
              <a
                href="#/Analytics%20-%20Retention"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Retention
              </a>
              <a
                href="#/Analytics%20-%20Alerts"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Alerts
              </a>
              <a
                href="#/Analytics%20-%20Interactions"
                className="px-4 py-2 bg-white border border-css-gold text-css-navy rounded-lg hover:bg-css-gold/10 transition-colors text-sm"
              >
                Interactions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-neumorphic overflow-hidden">
          <SwaggerUI
            url={SWAGGER_JSON_URL}
            docExpansion="list"
            defaultModelsExpandDepth={1}
            displayRequestDuration={true}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Server className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Live API Connection
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Real-time Documentation:</strong> This API documentation is connected to the live backend server and reflects the current state of all 14 analytics endpoints.
                </p>
                <p>
                  <strong>Interactive Testing:</strong> You can test API endpoints directly from this interface. All requests will be sent to the backend server running at <code className="bg-blue-100 px-2 py-1 rounded">{API_BASE_URL}</code>.
                </p>
                <p>
                  <strong>Authentication:</strong> Session-based authentication is configured. Login via <code className="bg-blue-100 px-2 py-1 rounded">/api/auth/login</code> to access protected endpoints.
                </p>
                <p>
                  <strong>Database:</strong> All endpoints are connected to the PostgreSQL database with 14 analytics tables for tracking performance, skills, training, sentiment, retention, and more.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Coverage Stats */}
        <div className="mt-6 bg-white border border-css-grey-medium/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-css-navy mb-4">
            API Coverage
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">14</p>
              <p className="text-sm text-blue-800 mt-1">Total Endpoints</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">8</p>
              <p className="text-sm text-green-800 mt-1">GET Endpoints</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">4</p>
              <p className="text-sm text-purple-800 mt-1">POST Endpoints</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">8</p>
              <p className="text-sm text-orange-800 mt-1">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
