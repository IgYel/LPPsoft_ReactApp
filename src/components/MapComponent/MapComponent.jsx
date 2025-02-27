import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import cityData from "../../mapComponents.json";
import { clearActiveList, restartAnimation } from "../../index";
import colors from "../../variables";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);
  const satelliteMap =
    "https://api.maptiler.com/maps/f92b4484-b0f8-4a93-b4a6-ecc3a68d5df6/style.json?key=x2m0mgXMvMyrNqsNWDX6";

  const defaultMap =
    "https://api.maptiler.com/maps/0581a604-2d9d-4150-a64a-7ae9d864dd26/style.json?key=x2m0mgXMvMyrNqsNWDX6";

  // Setting all the UseStates
  const [centerOfMap, setCenterOfMap] = useState(cityData[0].center);
  const [zoomOfMap, setZoomOfMap] = useState(5);
  const [sizeOfMarker, setSizeOfMarker] = useState("20px");
  const [lineWidth, setLineWidth] = useState(5);
  const [activeCity, setActiveCity] = useState();
  const [mapLinkAPI, setMapLinkAPI] = useState(defaultMap);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);

  const togglePhotoMode = () => {
    if (!isPhotoMode) {
      //Enable photo viewing mode
      setMapLinkAPI(satelliteMap);
      setIsInteractive(true);
      setIsPhotoMode(true);
      setZoomOfMap(12);

      // Hide the interface
      document.getElementById("TimeLineWrapper").style.display = "none";
    } else {
      // Return to normal mode
      setMapLinkAPI(defaultMap);
      setIsInteractive(false);
      setIsPhotoMode(false);
      setZoomOfMap(5);

      document.getElementById("TimeLineWrapper").style.display = "flex";
    }
  };

  const typeWriter = (element, text, speed) => {
    let i = 0;
    element.innerHTML = "";
    const interval = setInterval(() => {
      const char = text.charAt(i);
      element.innerHTML += char === "\n" ? "<br/>" : char;
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);
  };

  const setSvgAnimation = (element, isShow) => {
    if (isShow) {
      element.style.animation = "animateIcon 1s ease 1s forwards";
    } else {
      element.style.animation = "none";
    }
  };

  useEffect(() => {
    const openFullPhoto = document.querySelector("#openFullPhoto");
    const handleClick = (event) => {
      const timelineElement = event.target.closest(
        ".vertical-timeline-element"
      );
      clearActiveList();
      openFullPhoto.classList.remove("showButton");
      setSvgAnimation(openFullPhoto, false);

      if (timelineElement) {
        const nameElement = timelineElement.querySelector(".timeLineElName");
        const timelineName = nameElement
          ? nameElement.textContent.trim()
          : null;

        if (timelineName) {
          const city = cityData.find((item) => item.name === timelineName);
          if (city) {
            setCenterOfMap(city.center);
            setZoomOfMap(Number(city.mapZoom));
            setLineWidth(10);
            setSizeOfMarker("65px");
            setActiveCity(city);

            openFullPhoto.classList.add("showButton");
            setSvgAnimation(openFullPhoto, true);
          } else {
          }
        }

        timelineElement.classList.add("active");

        const textElement = timelineElement.querySelector(".timeLineElInfo");
        restartAnimation(textElement);
      } else {
        setCenterOfMap(cityData[0].center);
        setZoomOfMap(5);
        setLineWidth(5);
        setSizeOfMarker("20px");
        setActiveCity(undefined);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: centerOfMap,
        zoom: isPhotoMode ? 12 : zoomOfMap, // Set increased zoom in photo mode
        speed: 0.5,
        curve: 1.5,
        essential: true,
      });
    }
  }, [centerOfMap, zoomOfMap, isPhotoMode]);

  // Update marker sizes when sizeOfMarker changes
  useEffect(() => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        const markerEl = marker.getElement();
        const arrowOfMarker = markerEl.querySelector(".arrowOfMarker");
        if (arrowOfMarker) {
          arrowOfMarker.style.width = sizeOfMarker;
          arrowOfMarker.style.height = sizeOfMarker;
        }
      });
    }
  }, [sizeOfMarker]);

  // Update line width when lineWidth changes
  useEffect(() => {
    if (map.current && map.current.getLayer("line-layer")) {
      map.current.setPaintProperty("line-layer", "line-width", lineWidth);
    }
  }, [lineWidth]);

  // Update popup with typing effect when the active city changes
  useEffect(() => {
    if (map.current && activeCity) {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      const popupContent = `<div id="typewriter-content" style="color: ${colors.white1}; font-weight: bold; font-size: 20px;"></div>`;
      popupRef.current = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
      })
        .setLngLat(activeCity.center)
        .setHTML(popupContent)
        .addTo(map.current);

      setTimeout(() => {
        const typewriterEl = document.getElementById("typewriter-content");
        if (typewriterEl) {
          const fullText = `${activeCity.name}\n${activeCity.date}`;
          setTimeout(() => {
            typeWriter(typewriterEl, fullText, 100);
          }, 500);
        }
      }, 100);
    }
  }, [activeCity]);

  useEffect(() => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        const markerEl = marker.getElement();
        const arrowOfMarker = markerEl.querySelector(".arrowOfMarker");

        // Check if the marker matches the active city
        const isActive = activeCity && markerEl.id === activeCity.name;

        if (isActive) {
          arrowOfMarker.style.width = "55px";
          arrowOfMarker.style.height = "55px";
        } else {
          arrowOfMarker.style.width = "20px";
          arrowOfMarker.style.height = "20px";
        }
      });
    }

    if (map.current && map.current.getLayer("line-layer")) {
      map.current.setPaintProperty(
        "line-layer",
        "line-width",
        activeCity ? 10 : 5
      );
    }
  }, [activeCity]);

  // Set the map, markers and cities
  useEffect(() => {
    const openFullPhoto = document.querySelector("#openFullPhoto");

    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapLinkAPI,
        center: centerOfMap,
        zoom: zoomOfMap,
        interactive: isInteractive,
        pitch: isPhotoMode ? 0 : 45, // 🔹 Add tilt (default 45°)
        bearing: isPhotoMode ? 0 : -15, // 🔹 Slight map rotation (-15°)
      });

      map.current.on("load", () => {
        // 🔹 Smooth tilt transition when changing mode
        map.current.flyTo({
          pitch: isPhotoMode ? 0 : 45,
          bearing: isPhotoMode ? 0 : -15,
          duration: 1000,
        });

        // 🔹 Add markers for each city
        if (!isPhotoMode) {
          cityData.forEach((city) => {
            const markerElement = document.createElement("div");
            markerElement.id = city.name;
            const arrowOfMarker = document.createElement("div");
            markerElement.className = "custom-marker";

            arrowOfMarker.classList.add("arrowOfMarker");
            arrowOfMarker.style.width = sizeOfMarker;
            arrowOfMarker.style.height = sizeOfMarker;
            markerElement.appendChild(arrowOfMarker);

            markerElement.addEventListener("click", (e) => {
              e.stopPropagation();

              setCenterOfMap(city.center);
              setZoomOfMap(Number(city.mapZoom));
              setLineWidth(10);
              setSizeOfMarker("65px");
              setActiveCity(city);
              openFullPhoto.classList.add("showButton");
              setSvgAnimation(openFullPhoto, true);

              clearActiveList();

              const timelineElements = document.querySelectorAll(
                ".vertical-timeline-element"
              );
              timelineElements.forEach((elem) => {
                const nameElement = elem.querySelector(".timeLineElName");
                if (
                  nameElement &&
                  nameElement.textContent.trim() === city.name
                ) {
                  elem.classList.add("active");
                  const textElement = elem.querySelector(".timeLineElInfo");
                  restartAnimation(textElement);
                }
              });
            });

            const marker = new maplibregl.Marker({ element: markerElement })
              .setLngLat(city.center)
              .addTo(map.current);
            markersRef.current.push(marker);
          });

          // 🔹 Add a line connecting all markers
          const coordinates = cityData.map((city) => city.center);
          const geojsonLine = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
          };

          map.current.addSource("line", {
            type: "geojson",
            data: geojsonLine,
          });

          map.current.addLayer({
            id: "line-layer",
            type: "line",
            source: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": colors.white2,
              "line-width": lineWidth,
              "line-opacity": 0.35,
            },
          });
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapLinkAPI, isInteractive, isPhotoMode]);

  useEffect(() => {
    const openFullPhoto = document.querySelector("#openFullPhoto");
    if (openFullPhoto) {
      openFullPhoto.addEventListener("click", togglePhotoMode);
    }

    return () => {
      if (openFullPhoto) {
        openFullPhoto.removeEventListener("click", togglePhotoMode);
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      {isPhotoMode && (
        <button
          onClick={togglePhotoMode}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 5,
          }}
        >
          Exit Photo Mode
        </button>
      )}
    </div>
  );
};

export default MapComponent;
