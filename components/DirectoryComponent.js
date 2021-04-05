import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

function Directory(props) {
    
    const renderDirectorItem = ({item}) => {
        return (
            <ListItem 
                title={item.name}
                subtitle={item.description}
                leftAvatar={{ source: require('./images/react-lake.jpg')}}
            />
        )
    }

    return (
        <FlatList 
            data={props.campsites}
            renderItem={renderDirectorItem}
            keyExtractor={item => item.id.toString()}
        />
    )
}

export default Directory;