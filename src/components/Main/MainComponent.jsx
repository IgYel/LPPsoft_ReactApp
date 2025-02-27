import MapComponent from "../MapComponent/MapComponent";
import { PhotoIcon } from "../SVG";

import React from "react";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import colors from "../../variables";

import timeLineElements from "../../mapComponents.json";
import "react-vertical-timeline-component/style.min.css";

export const MainComponent = () => {
  return (
    <main
      className="Main"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        id="background"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          backgroundColor: "#19171f",
          zIndex: 0,
        }}
      ></div>
      <div
        id="TimeLineWrapper"
        style={{
          width: "50%",
          height: "100%",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(90deg,rgb(14, 15, 17), transparent 100%)`,
          color: colors.white1,
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <VerticalTimeline layout="1-column-left">
          {timeLineElements.map((element) => {
            return (
              <VerticalTimelineElement
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "20px 0",
                  cursor: "pointer",
                  padding: "0 25px 0 0",
                  width: "500px",
                  height: "fit-content",
                  transition: "0.2s ease",
                  // pointerEvents: "all",
                }}
                id={`V-Element${element.id}`}
                key={element.id}
                dateClassName="dateOfElement"
                icon={
                  <div
                    className="timeLineIcon"
                    style={{
                      backgroundColor: colors.white1,
                      width: "40px",
                      height: "40px",
                      borderRadius: "100%",
                      border: "0px solid",
                      transition: "0.2s ease",
                      pointerEvents: "all",
                    }}
                  ></div>
                }
              >
                <h3
                  className="timeLineElName"
                  style={{
                    pointerEvents: "all",
                  }}
                >
                  {element.name}
                </h3>
                <h5
                  className="timeLineElDate"
                  style={{
                    pointerEvents: "all",
                  }}
                >
                  {element.date}
                </h5>
                <div
                  className="timeLineElInfo"
                  style={{
                    marginTop: "10px",
                    opacity: 0,
                    display: "none",
                    opacity: "1",
                  }}
                >
                  {element.description}
                </div>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
      <MapComponent />
      <div
        id="openFullPhoto"
        style={{
          position: "absolute",
          bottom: "50px",
          alignSelf: "center",
          width: "20%",
          height: "40px",
          borderRadius: "100px",
          border: "5px solid",
          borderColor: "#CDCFD6",

          display: "flex",
          justifyContent: "space-between",
          backdropFilter: "blur(5px)",
          cursor: "pointer",

          opacity: "0",
          transition: "0.2s ease",
        }}
      >
        <PhotoIcon />
        <span
          className="showPhotoText"
          style={{
            height: "100%",
            width: "100%",
            alignContent: "center",
            textAlign: "center",
            marginRight: "25px",
            color: colors.white1,
          }}
        >
          open the photo
        </span>
      </div>
    </main>
  );
};
