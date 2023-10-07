import React, { type CSSProperties, memo } from "react";
import PropTypes from "prop-types";
import { GoogleMap, StandaloneSearchBox } from "@react-google-maps/api";

const ExampleSearchBoxPropTypes = {
	styles: PropTypes.shape({
		container: PropTypes.object.isRequired,
	}).isRequired,
};

const center: google.maps.LatLngLiteral = {
	lat: 0,
	lng: -180,
};

const inputStyle: CSSProperties = {
	boxSizing: `border-box`,
	border: `1px solid transparent`,
	width: `240px`,
	height: `32px`,
	padding: `0 12px`,
	borderRadius: `3px`,
	boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
	fontSize: `14px`,
	outline: `none`,
	textOverflow: `ellipses`,
	position: "absolute",
	top: "10px",
	right: "10px",
};

const onClick = (e: google.maps.MapMouseEvent) => {
	console.log("onClick args: ", e);
};

interface Props {
	styles: {
		container: CSSProperties | undefined;
	};
}

function ExampleSearchBox({ styles }: Props): JSX.Element {
	return (
		<div className="map">
			<div className="map-container">
				<GoogleMap id="search-box-example" mapContainerStyle={styles.container} zoom={2} center={center} onClick={onClick}>
					<StandaloneSearchBox>
						<input type="text" placeholder="Customized your placeholder" style={inputStyle} />
					</StandaloneSearchBox>
				</GoogleMap>
			</div>
		</div>
	);
}

ExampleSearchBox.propTypes = ExampleSearchBoxPropTypes;

export default memo(ExampleSearchBox);

//import React, { type CSSProperties, memo } from "react";
//import PropTypes from "prop-types";
//import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
//import GoogleMapsAPIKey from "../lib/APIKeys";
//
//const ExampleSearchBoxPropTypes = {
//	styles: PropTypes.shape({
//		container: PropTypes.object.isRequired,
//	}).isRequired,
//};
//
//const center: google.maps.LatLngLiteral = {
//	lat: 0,
//	lng: -180,
//};
//
//const inputStyle: CSSProperties = {
//	boxSizing: `border-box`,
//	border: `1px solid transparent`,
//	width: `240px`,
//	height: `32px`,
//	padding: `0 12px`,
//	borderRadius: `3px`,
//	boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//	fontSize: `14px`,
//	outline: `none`,
//	textOverflow: `ellipses`,
//	position: "absolute",
//	top: "10px",
//	right: "10px",
//};
//
//const onClick = (e: google.maps.MapMouseEvent) => {
//	console.log("onClick args: ", e);
//};
//
//interface Props {
//	styles: {
//		container: CSSProperties | undefined;
//	};
//}
//
//const ExampleSearchBox = ({ styles }: Props): JSX.Element => {
//	const { isLoaded, loadError } = useJsApiLoader({
//		id: "google-map-script",
//		googleMapsApiKey: GoogleMapsAPIKey,
//	});
//	const [map, setMap] = React.useState(null);
//
//	const renderMap = () => {
//		const onLoad = React.useCallback(function callback(map) {
//			const bounds = new window.google.maps.LatLngBounds(center);
//			map.fitBounds(bounds);
//
//			setMap(map);
//		}, []);
//		//const onPlacesChanged = () => console.log(this.searchBox.getPlaces());
//
//		return (
//			<GoogleMap id="search-box-example" mapContainerStyle={styles.container} zoom={2} center={center} onClick={onClick}>
//				<StandaloneSearchBox onLoad={onLoad}>
//					<input type="text" placeholder="Customized your placeholder" style={inputStyle} />
//				</StandaloneSearchBox>
//			</GoogleMap>
//		);
//	};
//
//	if (loadError) {
//		return <div>Map cannot be loaded right now, sorry.</div>;
//	}
//
//	return isLoaded ? renderMap() : <></>;
//};
//
///*onPlacesChanged={onPlacesChanged}*/
//
//ExampleSearchBox.propTypes = ExampleSearchBoxPropTypes;
//
//export default ExampleSearchBox;
