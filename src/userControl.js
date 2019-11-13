export default class UserControl{
    /**
     * the class constructor
     * @param {Joints} joints processes raw joints data from posenet
     */
    constructor(_joints){
        this.joints =  _joints;
        document.addEventListener('keydown', this.updateJoints);
    }
    
    updateJoints = (event) => {
        const joints = this.joints;
        const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
        const A = 65, S = 83, D =  68, W = 87;
        console.log('keyCode', event.keyCode);
        console.log('joints', joints);
        switch(event.keyCode){
            case LEFT:
                joints.update('rightShoulder', joints.data['rightShoulder'] - .1);
                console.log('rightShoulder', joints.data['rightShoulder']);
                break;
            case UP:
                joints.update('rightElbow', joints.data['rightElbow'] - .1);
                console.log('rightElbow', joints.data['rightElbow']);
                break;
            case RIGHT:
                joints.update('rightShoulder', joints.data['rightShoulder'] + .1);
                console.log('rightShoulder', joints.data['rightShoulder']);
                break;
            case DOWN:
                joints.update('rightElbow', joints.data['rightElbow'] + .1);
                console.log('rightElbow', joints.data['rightElbow']);
                break;
            case A:
                joints.update('leftShoulder', joints.data['leftShoulder'] - .1);
                console.log('leftShoulder', joints.data['leftShoulder']);
                break;
            case W:
                joints.update('leftElbow', joints.data['leftElbow'] - .1);
                console.log('leftElbow', joints.data['leftElbow']);
                break;
            case D:
                joints.update('leftShoulder', joints.data['leftShoulder'] + .1);
                console.log('leftShoulder', joints.data['leftShoulder']);
                break;
            case S:
                joints.update('leftElbow', joints.data['leftElbow'] + .1);
                console.log('leftElbow', joints.data['leftElbow']);
                break;
            default:
        }
    }
}