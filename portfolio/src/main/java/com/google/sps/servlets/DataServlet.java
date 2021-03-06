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

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that sends and returns comments.*/
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  
  private DatastoreService datastore;

  public void init(){
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery prepared = datastore.prepare(query);

    int limit = Integer.parseInt(request.getParameter("limit"));
    Iterable<Entity> results;
    if (limit != - 1) {
      results = prepared.asIterable(FetchOptions.Builder.withLimit(limit));
    }
    else {
      results = prepared.asIterable();
    }

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results) {
      long id = entity.getKey().getId();
      String userEmail = (String) entity.getProperty("userEmail");
      String content = (String) entity.getProperty("content");
      long timestamp = (long) entity.getProperty("timestamp");
      comments.add(new Comment(id, userEmail, content, timestamp));
    }

    String json = new Gson().toJson(comments);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String content = request.getParameter("comment-input");
    long timestamp = System.currentTimeMillis();
    UserService userService = UserServiceFactory.getUserService();
    String userEmail = userService.getCurrentUser().getEmail();

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("userEmail", userEmail);
    commentEntity.setProperty("content", content);
    commentEntity.setProperty("timestamp", timestamp);
    
    datastore.put(commentEntity);
    response.sendRedirect("/contact.html");
  }
}
