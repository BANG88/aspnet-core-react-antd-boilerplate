import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as WeatherForecastsState from '../store/WeatherForecasts';
import { Table, Icon } from 'antd';
// At runtime, Redux will merge together...
type WeatherForecastProps =
    WeatherForecastsState.WeatherForecastsState     // ... state we've requested from the Redux store
    & typeof WeatherForecastsState.actionCreators   // ... plus action creators we've requested
    & { params: { startDateIndex: string } };
// ... plus incoming routing parameters

interface WeatherProps {

}
class WeatherTable extends Table<WeatherProps>{

}
class FetchData extends React.Component<WeatherForecastProps, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let startDateIndex = parseInt(this.props.params.startDateIndex) || 0;
        this.props.requestWeatherForecasts(startDateIndex);
    }

    componentWillReceiveProps(nextProps: WeatherForecastProps) {
        // This method runs when incoming props (e.g., route params) change
        let startDateIndex = parseInt(nextProps.params.startDateIndex) || 0;
        this.props.requestWeatherForecasts(startDateIndex);
    }

    public render() {
        return <div>
            <h1>Weather forecast</h1>

            {this.renderForecastsTable()}
        </div>;
    }

    private renderForecastsTable() {

        return <WeatherTable            
            columns={[
                {
                    title: 'Date',
                    dataIndex: 'dateFormatted'
                },
                {
                    title: 'Temp. (C)',
                    dataIndex: 'temperatureC'
                },
                {
                    title: 'Temp. (F)',
                    dataIndex: 'temperatureF'
                },
                {
                    title: 'Summary',
                    dataIndex: 'summary'
                }
            ]}
            dataSource={this.props.forecasts}
            pagination={false}
            title={() => {
                return <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            }}
            footer={() => {
                return this.renderPagination()
            }}
        />

    }

    private renderPagination() {
        let prevStartDateIndex = this.props.startDateIndex - 5;
        let nextStartDateIndex = this.props.startDateIndex + 5;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={`/fetchdata/${prevStartDateIndex}`}>Previous</Link>
            <Link className='btn btn-default pull-right' to={`/fetchdata/${nextStartDateIndex}`}>Next</Link>
            {this.props.isLoading ? <span>Loading...</span> : []}
        </p>;
    }
}

export default connect(
    (state: ApplicationState) => state.weatherForecasts, // Selects which state properties are merged into the component's props
    WeatherForecastsState.actionCreators                 // Selects which action creators are merged into the component's props
)(FetchData);
