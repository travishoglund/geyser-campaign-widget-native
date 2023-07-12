import React from 'react';
import renderer from 'react-test-renderer';

import GeyserCampaign from './GeyserCampaign';
let sampleApiResponse;
const defaultMilestoneBackground = "#E9ECEF";
const milestoneColors = ["#20ECC7", "#10CAA8", "#03A88A", "#00866D", "#006452", "#004236"];

beforeEach(() => {
    sampleApiResponse = {"project":{"name":"nostrhackweek","title":"Nostr Hack & Design","balance":8495275},"currentMilestonePercent":39,"milestones":[{"id":"562","name":"Build track fully sponsored","description":"","amount":21980510,"reached":false}],"contributorsCount":22,"contributors":[{"imageUrl":"https://pbs.twimg.com/profile_images/1541955880752750592/XJqwIn2E_normal.jpg"},{"imageUrl":"https://storage.googleapis.com/geyser-images-distribution/0178a198-4f61-48af-82ed-a1fdc6032c7b_FpmvqISXgAE9Zzr/image_large.webp"},{"imageUrl":"https://pbs.twimg.com/profile_images/1604881269346783235/-SvNEW-C_normal.png"},{"imageUrl":"https://pbs.twimg.com/profile_images/1623646673254621184/jKYSu2ov_normal.png"},{"imageUrl":"https://pbs.twimg.com/profile_images/524043007327100928/nWsK2tFU_normal.png"},{"imageUrl":null},{"imageUrl":null}],"creator":{"imageUrl":"https://pbs.twimg.com/profile_images/1620577939183075328/ckP_EDFp_normal.jpg","username":"Στεlios ⚡"},"anonymousProfiles":[{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_51.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_52.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_53.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_54.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_55.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_56.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_57.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_58.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_59.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_60.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_61.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_62.png"},{"imageUrl":"https://storage.googleapis.com/geyser-projects-media/orbs/ellipse_63.png"}]};
})

afterEach(() => {
    jest.clearAllMocks();
});

describe('<GeyserCampaign />', () => {

    it('passes props correctly to component', () => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        expect(testRenderer.root.props.campaign).toEqual("nostrhackweek");
        expect(testRenderer.root.props.api).toEqual("https://api.staging.geyser.fund");
    });

    it('shows the spinner while loading', () => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const activityIndicator = testRenderer.root.findByType("ActivityIndicator");
        expect(testRenderer.root.instance.state).toEqual({data: {}, loading: true});
        expect(activityIndicator).toBeTruthy();
    });

    it('calls the API on initial load', () => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} />)
        expect(fetch).toHaveBeenCalledWith(`https://api.geyser.fund/widgets/project/nostrhackweek`);
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('shows an error if the API is down', async() => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.reject({})}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        expect(JSON.stringify(testRenderer.toJSON()).includes("Back Geyser Project")).toEqual(true);
    });

    it('renders the component with data from server', async() => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes("progress-circle")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`${sampleApiResponse.project.title}`)).toEqual(true);
    });

    it('will hide progress circle if milestones are completed', async() => {
        sampleApiResponse.milestones[0].reached = true;
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes("progress-circle")).toEqual(false);
        expect(JSON.stringify(testRenderer.toJSON()).includes("of milestone")).toEqual(false);
    });

    it('will hide progress circle if there are no milestones', async() => {
        sampleApiResponse.milestones = [];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes("progress-circle")).toEqual(false);
        expect(JSON.stringify(testRenderer.toJSON()).includes("of milestone")).toEqual(false);
    });

    it('will show total balance if all milestones are completed', async() => {
        sampleApiResponse.milestones = [];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(sampleApiResponse.project.balance.toLocaleString())).toEqual(true);
    });

    it('will show supporters followed by anonymous profiles', async() => {
        sampleApiResponse.contributors = [{imageUrl: "CONTRIBUTOR_1"},{imageUrl: "CONTRIBUTOR_2"},{imageUrl: "CONTRIBUTOR_3"},{imageUrl: "CONTRIBUTOR_4"},{imageUrl: "CONTRIBUTOR_5"},{imageUrl: "CONTRIBUTOR_6"}];
        sampleApiResponse.anonymousProfiles = [{imageUrl: "ANON_1"},{imageUrl: "ANON_2"},{imageUrl: "ANON_3"},{imageUrl: "ANON_4"},{imageUrl: "ANON_5"},{imageUrl: "ANON_6"},{imageUrl: "ANON_7"},{imageUrl: "ANON_8"},{imageUrl: "ANON_9"},{imageUrl: "ANON_10"},{imageUrl: "ANON_11"},{imageUrl: "ANON_12"},{imageUrl: "ANON_13"}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_1")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_2")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_3")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_4")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_5")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_6")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_7")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_8")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_9")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_10")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_11")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_12")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_13")).toEqual(true);
    });

    it('will substitute anonymous images for contributors if imageUrl is null', async() => {
        sampleApiResponse.contributors = [{imageUrl: "CONTRIBUTOR_1"},{imageUrl: null},{imageUrl: "CONTRIBUTOR_3"},{imageUrl: null},{imageUrl: "CONTRIBUTOR_5"},{imageUrl: null}];
        sampleApiResponse.anonymousProfiles = [{imageUrl: "ANON_1"},{imageUrl: "ANON_2"},{imageUrl: "ANON_3"},{imageUrl: "ANON_4"},{imageUrl: "ANON_5"},{imageUrl: "ANON_6"},{imageUrl: "ANON_7"},{imageUrl: "ANON_8"},{imageUrl: "ANON_9"},{imageUrl: "ANON_10"},{imageUrl: "ANON_11"},{imageUrl: "ANON_12"},{imageUrl: "ANON_13"}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_1")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_2")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_3")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_4")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("CONTRIBUTOR_5")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_6")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_7")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_8")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_9")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_10")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_11")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_12")).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes("ANON_13")).toEqual(true);
    });

    it('will show additional contributor count', async() => {
        sampleApiResponse.contributors = [{imageUrl: "CONTRIBUTOR_1"},{imageUrl: null},{imageUrl: "CONTRIBUTOR_3"},{imageUrl: null},{imageUrl: "CONTRIBUTOR_5"},{imageUrl: null}];
        sampleApiResponse.anonymousProfiles = [{imageUrl: "ANON_1"},{imageUrl: "ANON_2"},{imageUrl: "ANON_3"},{imageUrl: "ANON_4"},{imageUrl: "ANON_5"},{imageUrl: "ANON_6"},{imageUrl: "ANON_7"},{imageUrl: "ANON_8"},{imageUrl: "ANON_9"},{imageUrl: "ANON_10"},{imageUrl: "ANON_11"},{imageUrl: "ANON_12"},{imageUrl: "ANON_13"}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes("[\"+\",\"9\"]")).toEqual(true);
    });

    it('will use the correct progress colors if there is 1 milestone', async() => {
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${defaultMilestoneBackground}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[0]}"`)).toEqual(true);
    });

    it('will use the correct progress colors if current milestone is 2', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[0]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[1]}"`)).toEqual(true);
    });

    it('will use the correct progress colors if current milestone is 3', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_3","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[1]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[2]}"`)).toEqual(true);
    });

    it('will use the correct progress colors if current milestone is 4', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_3","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_4","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[2]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[3]}"`)).toEqual(true);
    });

    it('will use the correct progress colors if current milestone is 5', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_3","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_4","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_5","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[3]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[4]}"`)).toEqual(true);
    });

    it('will use the correct progress colors if current milestone is 6', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_3","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_4","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_5","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_6","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[4]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[5]}"`)).toEqual(true);
    });

    it('will reset milestone colors at Milestone 7', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_3","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_4","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_5","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_6","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_7","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[5]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[0]}"`)).toEqual(true);
    });

    it('will use correct colors at milestone 8', async() => {
        sampleApiResponse.milestones = [{"id":"562","name":"MILESTONE_1","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_2","description":"","amount":21980510,"reached":true},{"id":"562","name":"MILESTONE_3","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_4","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_5","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_6","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_7","description":"","amount":21980510,"reached":true}, {"id":"562","name":"MILESTONE_8","description":"","amount":21980510,"reached":false}];
        global.fetch = jest.fn(() => Promise.resolve({json: () => Promise.resolve(sampleApiResponse)}));
        const testRenderer = renderer.create(<GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />);
        const root = testRenderer.root;
        const instance = root.instance;
        await instance.componentDidMount()
        await instance.render()
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[0]}"`)).toEqual(true);
        expect(JSON.stringify(testRenderer.toJSON()).includes(`"backgroundColor":"${milestoneColors[1]}"`)).toEqual(true);
    });
});