import React from 'react';
import ReactLoading from 'react-loading';
import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';
import UserControl from './userControl';

/**
 * React Component for runnign neural networks and 3D graphics
 */
class App extends React.Component {

    /**
     * the class constructor
     * @param {args} props for the parent class
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            webcam: true,
            timeChange: 0
        }
    }

     /**
     * One of React's life cycle methods
     * Once the current React component is loaded, this function
     * initializes neural network model, graphics engine, and webcam.
     */
    async componentDidMount() {
        this.joints = new Joints();
        this.graphics_engine = new GraphicsEngine(this.refs.babylon, this.joints, this.updateState);
        this.posenet = new PoseNet(this.joints, this.graphics_engine, this.refs);
        this.userControl = new UserControl(this.joints);
        await this.posenet.loadNetwork();
        this.setState({loading: false});
        this.posenet.startPrediction().then((webcam) => {
            this.setState({ webcam });
        });
    }

    updateState = (time) => {
        this.setState({timeChange: time});
    }

    /** Asks for webcam access if ti was denied */
    askWebCam(){
        this.posenet.startPrediction();
    }

    changeInput = (event) =>{
        
    }

    changeInputBone = (event) =>{
        if(event.target.value > -1 && event.target.value < 58) this.joints.data.currentBone = event.target.value;
    }    

    /**
     * React Component's render method for rendering HTML components
     */
    render() {
        return (
            <div id="container" style={{ display: 'flex', padding: '5px'  }}>
                <canvas ref="babylon" width={500} height={500} style={{ display: 'block' }} />
                <video ref="video" id="video" playsInline style={{ display: 'none' }}/>
                <canvas ref="output" width={500} height={500} style={{ display: this.state.webcam ? 'block' : 'none' }}/>
                <div id="loader" style={{ display: !this.state.loading ? 'none' : 'none' }}>
                    <h3 id="loadTitle">Tensorflow Model loading ...</h3>
                    <ReactLoading type="cylon" color="grey" height={'20%'} width={'20%'} id="reactLoader"/>
                </div>
                {!this.state.webcam && <WeCamAccess/>}
                {
                this.joints &&
                <div style={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
                    <label htmlFor="head_x">Head x</label>
                    <input type="text" id="head_x" value={this.joints.data.head.x} readOnly={true} onChange={this.changeInput} />
                    <label htmlFor="head_y">Head y</label>
                    <input type="text" id="head_y" value={this.joints.data.head.y} readOnly={true} onChange={this.changeInput} />

                    <label htmlFor="rightShoulder">Right Shoulder</label>
                    <input type="text" id="rightShoulder" value={this.joints.data.rightShoulder} readOnly={true} onChange={this.changeInput} />
                    <label htmlFor="rightElbow">Right Elbow</label>
                    <input type="text" id="rightElbow" value={this.joints.data.rightElbow} readOnly={true} onChange={this.changeInput} />

                    <label htmlFor="leftShoulder">Left Shoulder</label>
                    <input type="text" id="leftShoulder" value={this.joints.data.leftShoulder} readOnly={true} onChange={this.changeInput} />
                    <label htmlFor="leftElbow">Left Elbow</label>
                    <input type="text" id="leftElbow" value={this.joints.data.leftElbow} readOnly={true} onChange={this.changeInput} />

                    <label htmlFor="leftHip">Left Hip</label>
                    <input type="text" id="leftHip" value={this.joints.data.leftHip} readOnly={true} onChange={this.changeInput} />
                    <label htmlFor="leftKnee">Left Knee</label>
                    <input type="text" id="leftKnee" value={this.joints.data.leftKnee} readOnly={true} onChange={this.changeInput} />

                    <label htmlFor="rightHip">right Hip</label>
                    <input type="text" id="rightHip" value={this.joints.data.rightHip} readOnly={true} onChange={this.changeInput} />
                    <label htmlFor="rightKnee">right Knee</label>
                    <input type="text" id="rightKnee" value={this.joints.data.rightKnee} readOnly={true} onChange={this.changeInput} />

                    <label htmlFor="bone">Bone</label>
                    <input type="number" id="bone" value={this.joints.data.currentBone} onChange={this.changeInputBone} />

                    <label htmlFor="boneValue">Value</label>
                    <input type="number" id="boneValue" value={this.joints.data.bones[this.joints.data.currentBone] ? this.joints.data.bones[this.joints.data.currentBone]: 0} onChange={this.changeInputBone} />
                </div>
                }
            </div>
        );
    }
}

const WeCamAccess = () => (
    <div id="webcamaccess">
        <h3>The device does not have a webcam OR webcam access was denied</h3>
        <button onClick={() => window.open("https://support.google.com/chrome/answer/2693767?p=ui_voice_search&visit_id=636795900385001472-2266950072&rd=1", "_blank")}>
            Grant Webcam Access
        </button>
    </div>);

export default App;