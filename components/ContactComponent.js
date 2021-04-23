import React, { Component } from 'react'
import { ScrollView, Text } from 'react-native'
import { Card } from 'react-native-elements'
import * as Animateable from 'react-native-animatable'

class Contact extends Component {
	static navigationOptions = {
		title: 'Contact Us',
	}

	render() {
		return (
			<ScrollView>
				<Animateable.View animation="fadeInDown" duration={2000} delay={1000}>
					<Card title="Contact Information" wrapperStyle={{ margin: 20 }}>
						<Text>1 Nucamp Way</Text>
						<Text>Seattle, WA 98001</Text>
						<Text style={{ marginBottom: 10 }}>U.S.A.</Text>
						<Text>Phone: 1-206-555-1234</Text>
						<Text>Email: campsites@nucamp.co</Text>
					</Card>
				</Animateable.View>
			</ScrollView>
		)
	}
}

export default Contact
