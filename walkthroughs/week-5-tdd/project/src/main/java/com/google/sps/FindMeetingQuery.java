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

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<Event> eventList = new ArrayList<>(events);
    Collections.sort(eventList, Event.ORDER_BY_START);
    Collection<TimeRange> meetingOptions = new ArrayList<>();
    TimeRange meetingOption = TimeRange.WHOLE_DAY;
    for(Event event : eventList){
      // no more meeting option, since the time left on the day is less than the requested duration
      if(meetingOption.duration() < request.getDuration()){
        break;
      }
      // event does not matter if it is not attended by any of the request's attendants
      if(!event.attendedBy(request.getAttendees())){
        continue;
      }

      TimeRange eventTime = event.getWhen();
      if(meetingOption.contains(eventTime)){
        TimeRange potentiaMeetingOption = (TimeRange.fromStartEnd(meetingOption.start(), eventTime.start(), false));
        if(potentiaMeetingOption.duration() >= request.getDuration()){
          meetingOptions.add(potentiaMeetingOption);
        }
        meetingOption = TimeRange.fromStartEnd(eventTime.end(), meetingOption.end(), false);
      }
      if(meetingOption.overlaps(eventTime)){
        meetingOption = TimeRange.fromStartEnd(eventTime.end(), meetingOption.end(), false);
      }

    }
    if(meetingOption.duration() >= request.getDuration()){
      meetingOptions.add(meetingOption);
    }
    return meetingOptions;
  }
}
