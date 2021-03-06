import React from 'react';
import PropTypes from 'prop-types';

import ActivityList from './ActivityList';

import { duration } from './filters';
import { propType as activityPropType } from './activity';

const shortDateFormat = new Intl.DateTimeFormat(navigator.language, {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
});

export class ActivityDurationSum extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(activityPropType).isRequired,
  };

  constructor(props) {
    super(props);
    if (this.props.activities.some(activity => !activity.finished_at)) {
      this.interval = setInterval(() => {
        this.forceUpdate();
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const durationSum = this.props.activities.reduce((sum, activity) => {
      const finishedAt = activity.finished_at || new Date();
      return sum + finishedAt.getTime() - activity.started_at.getTime();
    }, 0);
    return <span>{duration(durationSum)}</span>;
  }
}

export default class ActivitySummary extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(activityPropType).isRequired,
    title: PropTypes.string,
    date: PropTypes.instanceOf(Date).isRequired,
  };

  render() {
    return (
      <div
        className={
          'activity-summary-day' +
          (this.props.activities.length === 0 ? ' inactive' : '')
        }
      >
        <h3>
          {this.props.title || shortDateFormat.format(this.props.date)}
          <span className="activity-summary-total-duration">
            {this.props.activities.length === 0 ? (
              'No activities'
            ) : (
              <ActivityDurationSum activities={this.props.activities} />
            )}
          </span>
        </h3>
        <ActivityList activities={this.props.activities} />
      </div>
    );
  }
}
