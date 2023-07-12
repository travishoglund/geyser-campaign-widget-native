import React, { Component } from "react";
import PropTypes from 'prop-types'
import {
    ActivityIndicator,
    Image,
    Linking,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import ProgressCircle from './PercentageCircle'
import styles from './GeyserCampaignStyles';

export default class GeyserCampaign extends Component {
    static propTypes = {
        api: PropTypes.string,
        campaign: PropTypes.string.isRequired
    };

    static defaultProps = {
        api: 'https://api.geyser.fund'
    };

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            data: {}
        }
    }

    componentDidMount() {
        return fetch(`${this.props.api}/widgets/project/${this.props.campaign}`)
            .then(response => response.json())
            .then(data => this.setState({ loading: false, data: data }))
            .catch(error => this.setState({loading: false, error: true}));
    }

    render() {

        // Show Loading Spinner while API is loading
        if(this.state.loading === true) {
            return(
                <View style={styles.main}>
                    <ActivityIndicator />
                </View>
            );
        }

        // API output error
        if(this.state.error) {
            return(
                <View style={styles.main}>
                    <TouchableOpacity style={styles.inner} onPress={()=> {
                        Linking.openURL("https://geyser.fund/project/" + this.props.campaign);
                    }}>
                        Back Geyser Project: {this.props.campaign}
                    </TouchableOpacity>
                </View>
            )
        }

        // We can assume data is correct here
        let relevantMilestone;
        let milestoneNumber;
        let milestoneColor;
        let previousMilestoneColor;
        const milestoneColors = ["#20ECC7", "#10CAA8", "#03A88A", "#00866D", "#006452", "#004236"];
        const {data} = this.state;

        if(data.milestones.length > 0) {
            milestoneNumber = data.milestones.length - 1;
            for(var i = 0; i < data.milestones.length; i++) {
                if(data.milestones[i].reached === false) {
                    relevantMilestone = data.milestones[i];
                    milestoneNumber = i + 1;
                    break;
                }
            }
            milestoneColor = milestoneColors[ (milestoneNumber - 1) % 6 ];
            previousMilestoneColor = milestoneNumber === 1 ? "#E9ECEF" : milestoneColors[ (milestoneNumber - 2) % 6];
        }

        // Calculate our Supporters
        const contributors = [];
        for(let i = 0; i < Math.min(data.contributorsCount, 13); i++) {
            if(data.contributorsCount > i) {
                contributors.push(
                    (data.contributors.length > i && data.contributors[i].imageUrl) ?
                        data.contributors[i].imageUrl :
                        data.anonymousProfiles[i].imageUrl
                );
            }
        }

        return (
            <View style={styles.main}>
                <TouchableOpacity style={styles.inner} onPress={()=> {
                    Linking.openURL("https://staging.geyser.fund/project/" + data.project.name);
                }}>
                    <Text style={styles.title}>
                        {data.project.title}
                    </Text>
                    <View style={styles.meta}>
                        {relevantMilestone && (
                            <View style={styles.progress} testID="progress-circle">
                                <ProgressCircle
                                    percent={data.currentMilestonePercent}
                                    radius={50}
                                    borderWidth={20}
                                    color={milestoneColor || "#20ECC7"}
                                    shadowColor={previousMilestoneColor || "#E9ECEF"}
                                    bgColor="#fff"
                                >
                                </ProgressCircle>
                            </View>
                        )}
                        <View style={styles.metaDetails}>
                            <View style={styles.metaAmount}>
                                <View style={styles.metaAmountSymbol}>
                                    <Image style={{width: 22, height: 22}} source={require('./bitcoin-symbol.png')} />
                                </View>
                                <Text style={styles.metaAmountText}>{relevantMilestone ? relevantMilestone.amount.toLocaleString() : data.project.balance.toLocaleString()}</Text>
                            </View>
                            {relevantMilestone && (
                                <Text style={styles.metaDescription}>
                                    {data.currentMilestonePercent}% of Milestone {milestoneNumber}: {relevantMilestone.name}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.creator}>
                        <Text style={styles.creatorText}>by</Text>
                        <Image
                            style={{width: 28, height: 28, borderRadius: 14, marginLeft: 8, marginRight: 8}}
                            source={{
                                uri: data.creator.imageUrl,
                            }}
                        />
                        <Text style={styles.creatorText}>{data.creator.username}</Text>
                    </View>
                    <View style={styles.support}>
                        <Text style={styles.supportTitle}>
                            Top Supporters
                        </Text>
                        <View style={styles.supporters}>
                            {contributors.map((contributorImage, i) => (
                                <Image
                                    key={i}
                                    style={styles.contributorImage}
                                    source={{
                                        uri: contributorImage,
                                    }}
                                />
                            ))}
                            {data.contributorsCount > 13 && (
                                <View style={styles.additionalContributors}><Text style={styles.additionalContributorsText}>+{data.contributorsCount - 13}</Text></View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }
}