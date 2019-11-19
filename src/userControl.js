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

        switch(event.keyCode){
            case LEFT:
                joints.update('rightShoulder', joints.data['rightShoulder'] - .1);
                break;
            case UP:
                joints.update('rightElbow', joints.data['rightElbow'] - .1);
                break;
            case RIGHT:
                joints.update('rightShoulder', joints.data['rightShoulder'] + .1);
                break;
            case DOWN:
                joints.update('rightElbow', joints.data['rightElbow'] + .1);
                break;
            case A:
                joints.update('leftShoulder', joints.data['leftShoulder'] - .1);
                break;
            case W:
                joints.update('leftElbow', joints.data['leftElbow'] - .1);
                break;
            case D:
                joints.update('leftShoulder', joints.data['leftShoulder'] + .1);
                break;
            case S:
                joints.update('leftElbow', joints.data['leftElbow'] + .1);
                break;
            default:
        }
    }
}