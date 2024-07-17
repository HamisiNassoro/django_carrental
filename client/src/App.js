import { Layout } from "antd";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import AppFooter from "./components/common/AppFooter";
import AppHeader from "./components/common/AppHeader";
import HomePage from "./pages/HomePage";
import CarListPage from "./pages/CarListPage";

const { Content, Header, Footer } = Layout;

function App() {
	return (
		<Router>
			<Layout className="main-layout">
				<Header>
					<AppHeader />
				</Header>
				<Content>
					<Route exact path="/" component={HomePage} />
					<Route
						exact
						path="/cars"
						component={CarListPage}
					/>
				</Content>
				<Footer>
					<AppFooter />
				</Footer>
			</Layout>
		</Router>
	);
}

export default App;