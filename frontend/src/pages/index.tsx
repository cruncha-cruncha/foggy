import * as React from "react";
import { useState } from "react";
import dayjs from "dayjs";
import input from '../../content/weather.json';
import { WeatherProvider } from "../components/WeatherProvider";
import { validateInputData } from "../logic/validateInputData";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';

const Testing = () => {

    const [providerIndex, setProviderIndex] = useState(0);

    const inputData = validateInputData(input);

    const provider = inputData && inputData.data[providerIndex];

    return (
        <Container>
            {inputData && provider && (<>
                <Row className="justify-content-center">
                    <Col xs md="8" lg="6">
                        <div className="pre-amble">
                            <h1>{inputData.city} Weather</h1>
                            <p>Tomorrow: {formatTomorrow(inputData.tomorrow)}</p>
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs md="8" lg="6">
                        <div className="content">
                            <WeatherProvider data={provider} tomorrow={inputData.tomorrow} />
                        </div>
                    </Col>
                </Row>
                {/* TODO: fix/float this row at the bottom of the screen */}
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <ButtonGroup>
                            {inputData.data.map((datum, i) => {
                                return (
                                    <Button key={datum.name} variant={i === providerIndex ? "primary" : "outline-primary"}>{datum.name}</Button>
                                )
                            })}
                        </ButtonGroup>
                    </Col>
                </Row>
            </>)}
            {!inputData && (
                <p>nope</p>
            )}
        </Container>
    )
}

export default Testing;

const formatTomorrow = (tomorrow: string) => {
    return dayjs(tomorrow).format("YYYY-MM(MMMM)-DD");
}

