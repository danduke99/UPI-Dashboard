import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';

import {
  Scheduler,
  Resources,
  MonthView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  DragDropProvider,
  DayView,
  WeekView,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AllDayPanel,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Box, Container } from '@material-ui/core';
import { appointments, resourcesData } from '../data/appointments';
import { owners } from '../data/tasks';

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
      resources: [
        {
          fieldName: 'roomId',
          title: 'Room',
          instances: resourcesData,
        },
        {
          fieldName: 'members',
          title: 'Members',
          instances: owners,
          allowMultiple: true,
        },
      ],
    };

    this.commitChanges = this.commitChanges.bind(this);
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map((appointment) => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
      }
      return { data };
    });
  }

  render() {
    const { data, resources } = this.state;

    return (
      <>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container>
            <Paper>
              <Scheduler
                data={data}
                height={640}
              >
                <ViewState
                  defaultCurrentDate="2017-05-25"
                  defaultCurrentViewName="Month"
                />
                <EditingState
                  onCommitChanges={this.commitChanges}
                />
                <EditRecurrenceMenu />
                <IntegratedEditing />
                <DayView
                  startDayHour={6}
                  endDayHour={22}
                />
                <WeekView
                  name="work-week"
                  displayName="Work Week"
                  excludedDays={[0]}
                  startDayHour={9}
                  endDayHour={19}
                />
                <MonthView />
                <Toolbar />
                <DateNavigator />
                <ViewSwitcher />
                <AllDayPanel />
                <EditRecurrenceMenu />
                <ConfirmationDialog />
                <Appointments />
                <AppointmentTooltip
                  showOpenButton
                />
                <AppointmentForm />

                <Resources
                  data={resources}
                  mainResourceName="roomId"
                />
                <DragDropProvider />
              </Scheduler>
            </Paper>
          </Container>
        </Box>
      </>
    );
  }
}
