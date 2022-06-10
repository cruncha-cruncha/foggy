import dayjs from "dayjs";
import * as React from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryErrorBar, VictoryLabel, VictoryLine } from 'victory';
import { snapshotToGraphical } from "../logic/snapshotToGraphical";
import { validateSnapTiming } from "../logic/validateSnapTiming";
import { Graphical } from "../types/Graphical";
import { Input as InputType } from "../types/Input";
import { WeatherProvider as WeatherType } from '../types/WeatherProvider';

const oneHour = 60 * 60;
const halfHour = 60 * 30;
const PADDING = { top: 0, right: 30, bottom: 10, left: 20 }

type Props = Pick<InputType, 'tomorrow'> & {
    data: WeatherType,
}

export const WeatherProvider = ({ data, tomorrow }: Props) => {

    validateSnapTiming({ snaps: data.snaps, tomorrow });
    const graphData = data.snaps.map(snapshotToGraphical);

    return (
        <div>
            <p>Source: {data.name}</p>
            <p>Sunrise: {dayjs(data.sunrise).format("HH:mm")}</p>
            <div className="data">
                <TimeAxis graphData={graphData} />
                <FogChart graphData={graphData} />
                <TemperatureChart graphData={graphData} />
                <WindChart graphData={graphData} />
                <VisibilityChart graphData={graphData} />
            </div>
        </div>
    )
}

const TimeAxis = ({
    graphData
}: {
    graphData: Graphical[]
}) => {
    const { maxTime, minTime } = getXDomain(graphData);

    return (
        <VictoryChart
            maxDomain={{ x: maxTime }}
            minDomain={{ x: minTime }}
            height={30}
            padding={{ top: 30, right: PADDING.right, bottom: 0, left: PADDING.left }}
        >
            <VictoryAxis
                tickValues={graphData.map(gd => gd.time)}
                tickCount={3}
                orientation="top"
                tickFormat={(t) => `${dayjs.unix(t).format("HH")}`}
                style={{
                    axis: { stroke: "#756f6a" },
                    ticks: { stroke: "grey", size: 5 },
                    tickLabels: { fontSize: 18, padding: 0 }
                }}
            />
        </VictoryChart>
    )
}

const FogChart = ({
    graphData
}: {
    graphData: Graphical[]
}) => {
    const { maxTime, minTime } = getXDomain(graphData);

    return (
        <VictoryChart
            maxDomain={{ x: maxTime }}
            minDomain={{ x: minTime }}
            height={30}
            padding={{ top: 0, right: PADDING.right, bottom: 30, left: PADDING.left }}
        >
            <VictoryAxis
                tickValues={graphData.map(gd => gd.time + halfHour)}
                tickFormat={(t, i) => graphData[i].fog ? "1" : "0"}
                style={{
                    axis: { stroke: "" },
                    tickLabels: { fontSize: 18, padding: 5 }
                }}
            />
        </VictoryChart>
    )
}

const TemperatureChart = ({
    graphData
}: {
    graphData: Graphical[]
}) => {
    const { maxTime, minTime } = getXDomain(graphData);

    const parseYVal = (datum: Graphical) => {
        if (datum.temperatureDifference < 0) {
            return 0;
        } else if (datum.temperatureDifference > 5) {
            return 5;
        } else {
            return datum.temperatureDifference;
        }
    }

    return (
        <VictoryChart
            maxDomain={{ x: maxTime, y: 5 }}
            minDomain={{ x: minTime, y: 0 }}
            height={180}
            padding={PADDING}
        >
            <VictoryAxis dependentAxis
                tickValues={[0, 3]}
                orientation="right"
                style={{
                    axis: { stroke: "#756f6a" },
                    grid: { stroke: ({ tick }) => tick === 3 ? "grey" : "" },
                    tickLabels: { fontSize: 18, padding: 4 }
                }}
            />
            <VictoryAxis dependentAxis
                label="Temp - Dew point (C)"
                style={{
                    axis: { stroke: "#756f6a" },
                    tickLabels: { fontSize: 0 },
                    axisLabel: { padding: 5 }
                }}
            />
            <VictoryBar
                data={graphData}
                x="time"
                y={parseYVal}
                alignment="start"
                domain={{ y: [0, 5] }}
                barRatio={1.2}
                style={{
                    data: {
                        fill: "#000000"
                    }
                }}
            />
        </VictoryChart>
    )
}

const WindChart = ({
    graphData
}: {
    graphData: Graphical[],
}) => {
    const { maxTime, minTime } = getXDomain(graphData);

    const parseYVal = (datum: Graphical) => {
        if (datum.windSpeed < 0) {
            return 0;
        } else if (datum.windSpeed > 15) {
            return 15;
        } else {
            return datum.windSpeed;
        }
    }

    const gustData = [
        {
            ...graphData[0],
            time: graphData[0].time - halfHour
        },
        ...graphData,
        {
            ...graphData[graphData.length - 1],
            time: graphData[graphData.length - 1].time + halfHour
        }
    ]

    return (
        <VictoryChart
            maxDomain={{ x: maxTime, y: 15 }}
            minDomain={{ x: minTime, y: 0 }}
            height={180}
            padding={PADDING}
        >
            <VictoryAxis dependentAxis
                orientation="right"
                tickValues={[0, 5, 10]}
                style={{
                    axis: { stroke: "#756f6a" },
                    grid: { stroke: ({ tick }) => [5, 10].includes(tick) ? "grey" : "" },
                    tickLabels: { fontSize: 18, padding: 4 }
                }}
            />
            <VictoryAxis dependentAxis
                label='Wind Speed (kt)'
                style={{
                    axis: { stroke: "#756f6a" },
                    tickLabels: { fontSize: 0 },
                    axisLabel: { padding: 5 }
                }}
            />
            <VictoryLine
                data={gustData}
                x={(datum) => datum.time + halfHour}
                y={(datum) => datum.gusts}
                interpolation="monotoneX"
            />
            <VictoryBar
                data={graphData}
                x="time"
                y={parseYVal}
                alignment="start"
                barRatio={1.2}
                style={{
                    data: {
                        fill: "#000000"
                    }
                }}
            />
        </VictoryChart>
    )
}

const VisibilityChart = ({
    graphData
}: {
    graphData: Graphical[],
}) => {
    const { maxTime, minTime } = getXDomain(graphData);

    const parseYVal = (datum: Graphical) => {
        if (datum.visibility < 0) {
            return 0;
        } else if (datum.visibility > 5) {
            return 5;
        } else {
            return datum.visibility;
        }
    }

    return (
        <VictoryChart
            maxDomain={{ x: maxTime, y: 5 }}
            minDomain={{ x: minTime, y: 0 }}
            height={180}
            padding={PADDING}
        >
            <VictoryAxis dependentAxis
                orientation="right"
                tickValues={[0, 1, 2]}
                style={{
                    axis: { stroke: "#756f6a" },
                    grid: { stroke: ({ tick }) => [1, 2].includes(tick) ? "grey" : "" },
                    tickLabels: { fontSize: 18, padding: 4 }
                }}
            />
            <VictoryAxis dependentAxis
                label="Visibility (km)"
                style={{
                    axis: { stroke: "#756f6a" },
                    tickLabels: { fontSize: 0 },
                    axisLabel: { padding: 5 }
                }}
            />
            <VictoryBar
                data={graphData}
                x="time"
                y={parseYVal}
                alignment="start"
                barRatio={1.2}
                style={{
                    data: {
                        fill: "#000000"
                    }
                }}
            />
        </VictoryChart>
    )
}

const getXDomain = (graphData: Graphical[]) => {
    return {
        maxTime: graphData[graphData.length - 1].time + oneHour,
        minTime: graphData[0].time,
    };
}
