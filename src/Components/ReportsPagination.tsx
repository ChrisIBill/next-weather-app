import "../styles.scss";
import "../Components/ReportsPagination.scss";
import { Box, Container, List, Paper, Typography } from "@mui/material";
import usePagination from "@mui/material/usePagination/usePagination";
import moment from "moment";
import { useState } from "react";
import { DayWeatherData } from "../lib/interfaces";

const ReportPaginationButton = ({
    dayData,
    index,
    onClick,
}: {
    dayData: DayWeatherData;
    index: number;
    onClick: any;
}) => {
    const dayOfWeek = moment(dayData.dt, "X").format("dddd");
    const temperatures = dayData.data.temps;
    const weatherCondition = dayData.data.weather.main;
    const imgSrc = dayData.data.weather.img_src;
    console.log("Img Src = " + imgSrc);
    return (
        <Box
            className="cssMaskingGrid PaginationPageContainer"
            style={{ borderRadius: "12px" }}
            onClick={() => {
                onClick(index);
            }}
        >
            <Box
                className="cssGridMask"
                style={{
                    background:
                        "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.3) 25.79%)",
                }}
            >
                <Typography>{dayOfWeek}</Typography>
                <Typography variant="h1">{temperatures.avg}</Typography>
            </Box>
            <Box
                className="cssGridImage PaginationPageImage"
                style={{
                    backgroundImage: `url(${imgSrc})`,
                    height: "100%",
                    width: "100%",
                }}
            ></Box>
        </Box>
    );
};
export const ReportsPagination = ({
    weekData,
    handleChange,
}: {
    weekData: DayWeatherData[];
    handleChange: any;
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const { items } = usePagination({
        count: 8,
        hideNextButton: true,
        hidePrevButton: true,
        boundaryCount: 2,
    });
    /* const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }; */
    return (
        <nav
            id="PaginationNavBar"
            className="cssGridMask"
            style={{ display: "flex", height: "150px" }}
        >
            <List id="PaginationList" sx={{ display: "flex", flex: "1" }}>
                {items.map(({ page, type, selected, ...item }, index) => {
                    let children = null;

                    if (type === "start-ellipsis" || type === "end-ellipsis") {
                        children = "…";
                    } else if (type === "page") {
                        children = (
                            <ReportPaginationButton
                                //What does {...item} do here?
                                {...item}
                                index={index}
                                dayData={weekData[index]}
                                onClick={() => handleChange(index)}
                            />
                        );
                    } else {
                        children = (
                            <button type="button" {...item}>
                                {type}
                            </button>
                        );
                    }

                    return (
                        <li
                            className="PaginationElemWrapper"
                            key={index}
                            style={{
                                display: "flex",
                                flex: "1 1 20%",

                                //backgroundColor: "rgba(0, 0, 0, 0)",
                                //color: "rgba(0, 0, 0, 0)",
                            }}
                        >
                            {children}
                        </li>
                    );
                })}
            </List>
        </nav>
    );
};

export const ReportsPagination2 = ({
    weekData,
    handleChange,
}: {
    weekData: DayWeatherData[];
    handleChange: any;
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const { items } = usePagination({
        count: 8,
        hideNextButton: true,
        hidePrevButton: true,
        boundaryCount: 2,
    });
    /* const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageIndex(value);
    }; */
    return (
        <nav style={{ display: "flex", height: "150px" }}>
            <List sx={{ display: "flex", flex: "1" }}>
                {items.map(({ page, type, selected, ...item }, index) => {
                    let children = null;

                    if (type === "start-ellipsis" || type === "end-ellipsis") {
                        children = "…";
                    } else if (type === "page") {
                        children = (
                            //<ReportPaginationButton dayData={weekData[index]} />
                            <button
                                type="button"
                                style={{
                                    fontWeight: selected ? "bold" : undefined,
                                    flex: "1 1 10%",
                                    background:
                                        "linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.3) 25.79%)",
                                    //backgroundColor: "rgba(0, 0, 0, 0)",
                                    //color: "rgba(0, 0, 0, 0)",
                                }}
                                onClick={() => handleChange(index)}
                                {...items}
                            >
                                <ReportPaginationButton
                                    index={0}
                                    dayData={weekData[index]}
                                    onClick={() => handleChange(index)}
                                />
                            </button>
                        );
                    } else {
                        children = (
                            <button type="button" {...item}>
                                {type}
                            </button>
                        );
                    }

                    return (
                        <li
                            key={index}
                            style={{
                                display: "flex",
                                flex: "1 1 20%",

                                //backgroundColor: "rgba(0, 0, 0, 0)",
                                //color: "rgba(0, 0, 0, 0)",
                            }}
                        >
                            {children}
                        </li>
                    );
                })}
            </List>
        </nav>
    );
};
