/**
 * Joints class for storing 
 * joints data from posenet
 */
export default class Joints{

    /** the class constructor */
    constructor(){
        this.data = {
            'rightShoulder': 2.2,
            'rightElbow': 0,
            'leftShoulder': 2.2,
            'leftElbow': 0,
            'rightHip': 3.3,
            'rightKnee': 0,
            'leftHip': 3.3,
            'leftKnee': 0,
            'head': {
                'x': 0, 'y': 0
            },
            currentBone: 1,
            bones: []
        }
    }

    /** joint data setter */
    update = (joint, val) => {
        if(joint.toString().indexOf('Hip') > -1 ||
        joint.toString().indexOf('Knee') > -1){
            console.log(joint,val);
        }

        this.data[joint] = val;
    }

    updateBone = (current, val) => {
        this.data.bones[current] = val;
    }

    /** joint data getter */
    get(joint){
        return this.data[joint];
    }
}