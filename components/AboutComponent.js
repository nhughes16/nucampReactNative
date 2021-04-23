import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { ScrollView, Text, View } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import Loading from './LoadingComponent'
import * as Animateable from 'react-native-animatable'

const mapStateToProps = (state) => {
	return {
		partners: state.partners,
	}
}

class About extends Component {
	static navigationOptions = {
		title: 'About Us',
	}

	render() {
		if (this.props.partners.isLoading) {
			return (
				<ScrollView>
					<Mission />
					<Card title="Commity Partners">
						<Loading />
					</Card>
				</ScrollView>
			)
		}
		if (this.props.partners.errMess) {
			return (
				<ScrollView>
					<Animateable.View animation="fadeInDown" duration={2000} delay={1000}>
						<Mission />
						<Card title="Commity Partners">
							<Text>{this.props.partners.errMess}</Text>
						</Card>
					</Animateable.View>
				</ScrollView>
			)
		}
		return (
			<ScrollView>
				<Animateable.View animation="fadeInDown" duration={2000} delay={1000}>
					<Mission />
					<Card title="Commity Partners">
						<FlatList data={this.props.partners.partners} renderItem={renderPartner} keyExtractor={(item) => item.id.toString()} />
					</Card>
				</Animateable.View>
			</ScrollView>
		)
	}
}

function Mission() {
	return (
		<Card title="Our Mission">
			<Text style={{ margin: 10 }}>
				We present a curated database of the best campsites in the vast woods and backcountry of the World Wide Web Wilderness. We increase
				access to adventure for the public while promoting safe and respectful use of resources. The expert wilderness trekkers on our staff
				personally verify each campsite to make sure that they are up to our standards. We also present a platform for campers to share
				reviews on campsites they have visited with each other.
			</Text>
		</Card>
	)
}

function renderPartner({ item }) {
	if (item) {
		return <ListItem title={item.name} subtitle={item.description} leftAvatar={{ source: { uri: baseUrl + item.image } }} />
	}
	return <View />
}

export default connect(mapStateToProps)(About)
