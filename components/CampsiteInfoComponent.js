import React, { Component } from 'react'
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native'
import { Card, Icon, Rating, Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import { postComment, postFavorite } from '../redux/ActionCreators'
import * as Animateable from 'react-native-animatable'

const mapStateToProps = (state) => {
	return {
		campsites: state.campsites,
		comments: state.comments,
		favorites: state.favorites,
	}
}

const mapDispatchToProps = {
	postFavorite: (campsiteId) => postFavorite(campsiteId),
	postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text),
}

function RenderCampsite(props) {
	const { campsite } = props

	const view = React.createRef()

	const recognizeDrag = ({ dx }) => dx < -200

	const recognizeComment = ({ dx }) => dx > 200

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onPanResponderGrant: () => {
			view.current.rubberBand(1000).then((endState) => console.log(endState.finished ? 'finished' : 'canceled'))
		},
		onPanResponderEnd: (e, gestureState) => {
			console.log('pan responder end: ', gestureState)
			if (recognizeDrag(gestureState)) {
				Alert.alert(
					'Add Favorite',
					'Are you sure you wish to add ' + campsite.name + ' to favorite?',
					[
						{
							text: 'Cancel',
							style: 'cancel',
							onPress: () => console.log('Cancel Pressed'),
						},
						{
							text: 'OK',
							onPress: () => (props.favorite ? console.log('Already set as a favorite') : props.markFavorite()),
						},
					],
					{ cancelable: false },
				)
			}
			if (recognizeComment(gestureState)) {
				props.onShowModal()
			}
		},
	})

	if (campsite) {
		return (
			<Animateable.View animation="fadeInDown" duration={2000} delay={1000} ref={view} {...panResponder.panHandlers}>
				<Card featuredTitle={campsite.name} image={{ uri: baseUrl + campsite.image }}>
					<Text style={{ margin: 10 }}>{campsite.description}</Text>
					<View style={styles.cardRow}>
						<Icon
							name={props.favorite ? 'heart' : 'heart-o'}
							type="font-awesome"
							color="#f50"
							raised
							reverse
							onPress={() => (props.favorite ? console.log('Already set as a favorite') : props.markFavorite())}
						/>
						<Icon name="pencil" type="font-awesome" color="#5637DD" raised reverse onPress={() => props.onShowModal()} />
					</View>
				</Card>
			</Animateable.View>
		)
	}
	return <View />
}

function RenderComments({ comments }) {
	const renderCommentItem = ({ item }) => {
		return (
			<View style={{ margin: 10 }}>
				<Text style={{ fontSize: 14 }}>{item.text}</Text>
				<Rating startingValue={item.rating} imageSize={10} style={{ alignItems: 'flex-start', paddingVertical: '5%' }} readonly />
				<Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date} `}</Text>
			</View>
		)
	}

	return (
		<Animateable.View animation="fadeInUp" duration={2000} delay={1000}>
			<Card title="Comments">
				<FlatList data={comments} renderItem={renderCommentItem} keyExtractor={(item) => item.id.toString()} />
			</Card>
		</Animateable.View>
	)
}

class CampsiteInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			rating: 5,
			author: '',
			text: '',
			showModal: false,
		}
	}

	markFavorite(campsiteId) {
		this.props.postFavorite(campsiteId)
	}

	static navigationOptions = {
		title: 'Campsite Information',
	}

	toggleModal() {
		this.setState({ showModal: !this.state.showModal })
	}

	handleComment(campsiteId) {
		console.log('handle submit:', campsiteId, this.state.rating, this.state.author, this.state.text)
		this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text)
		this.toggleModal()
	}

	resetForm() {
		this.setState({
			rating: 5,
			author: '',
			text: '',
			showModal: false,
		})
	}

	render() {
		const campsiteId = this.props.navigation.getParam('campsiteId')
		const campsite = this.props.campsites.campsites.filter((campsite) => campsite.id === campsiteId)[0]
		const comments = this.props.comments.comments.filter((comment) => comment.campsiteId === campsiteId)
		return (
			<ScrollView>
				<RenderCampsite
					campsite={campsite}
					favorite={this.props.favorites.includes(campsiteId)}
					markFavorite={() => this.markFavorite(campsiteId)}
					onShowModal={() => this.toggleModal()}
				/>
				<RenderComments comments={comments} />

				<Modal animationType={'slide'} transparent={false} visible={this.state.showModal} onRequestClose={() => this.toggleModal()}>
					<View style={styles.modal}>
						<Rating
							showRating
							startingValue={this.state.rating}
							imageSize={40}
							onFinishRating={(value) => this.setState({ rating: value })}
							style={{ paddingVertical: 10 }}
						/>
						<Input
							placeholder="Name"
							leftIcon={{ name: 'user-o', type: 'font-awesome' }}
							leftIconContainerStyle={{ paddingRight: 10 }}
							onChangeText={(value) => this.setState({ author: value })}
							value={this.state.author}
						/>
						<Input
							placeholder="Review"
							leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
							leftIconContainerStyle={{ paddingRight: 10 }}
							onChangeText={(value) => this.setState({ text: value })}
							value={this.state.text}
						/>
						<View style={{ margin: 10 }}>
							<Button
								onPress={() => {
									this.handleComment(campsiteId)
									this.resetForm()
								}}
								color="#5637DD"
								title="Submit"
							/>
						</View>
						<View style={{ margin: 10 }}>
							<Button
								onPress={() => {
									this.toggleModal()
									this.resetForm()
								}}
								color="#808080"
								title="Cancel"
							/>
						</View>
					</View>
				</Modal>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'center',
		margin: 20,
	},
	cardRow: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'row',
		margin: 20,
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo)
