// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import com.google.sps.data.Location;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that sends and returns user locations.*/
@WebServlet("/user-location-data")
public class LocationServlet extends HttpServlet {
  
  private DatastoreService datastore;

  public void init(){
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Location");
    PreparedQuery results = datastore.prepare(query);

    List<Location> locations = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      double lat = (double) entity.getProperty("latitude");
      double lng = (double) entity.getProperty("longitude");
      long timestamp = (long) entity.getProperty("timestamp");
      locations.add(new Location(lat, lng, timestamp));
    }

    String json = new Gson().toJson(locations);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long timestamp = System.currentTimeMillis();
    double lat = Double.parseDouble(request.getParameter("lat"));
    double lng = Double.parseDouble(request.getParameter("lng"));

    Entity locationEntity = new Entity("Location");
    locationEntity.setProperty("latitude", lat);
    locationEntity.setProperty("longitude", lng);
    locationEntity.setProperty("timestamp", timestamp);
    
    datastore.put(locationEntity);
    response.sendRedirect("/gallery.html");
  }
}
