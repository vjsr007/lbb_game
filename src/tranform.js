/**
 * Transform class for mapping 
 * joints data from video stream space 
 * into Babylon 3D space
 */
export default class Transform{

    /**
     * the class constructor
     * @param {Joints} _joints 
     */
    constructor(_joints){
        this.joints = _joints;
    }

    /*
        leftAnkle: {x: 415.81812164662875, y: 440.7798974894364}
        leftEar: {x: 500.4029032785141, y: 303.3018000858767}
        leftElbow: {x: 515.1193225430144, y: 525.4962490690358}
        leftEye: {x: 435.03748674800886, y: 278.1692386137372}
        leftHip: {x: 459.59333130357794, y: 511.1722834843142}
        leftKnee: {x: 487.0427053726137, y: 22.801362123006975}
        leftShoulder: {x: 490.00424633694064, y: 479.23638013550277}
        leftWrist: {x: 447.25615505114604, y: 467.6700992806876}
        nose: {x: 384.5962940023103, y: 327.36229803775535}
        rightAnkle: {x: 411.3133946281463, y: 439.3899227394668}
        rightEar: {x: 269.3439884408439, y: 289.98408336119894}
        rightElbow: {x: 508.2387367575085, y: 520.2278107520671}
        rightEye: {x: 335.3771699541738, y: 284.9848706434673}
        rightHip: {x: 466.99372525345024, y: 503.25030018847275}
        rightKnee: {x: 490.68397492286294, y: 23.544923804613404}
        rightShoulder: {x: 139.54024556082047, y: 515.6467897882721}
        rightWrist: {x: 469.07120641567366, y: 445.87698613623235}
    */

    /**
     * Updates joints data
     * @param {array} _keypoints raw joints data from posenet
     * @param {float} treshHoldScore for determining whether to update or no
     */
    updateKeypoints(_keypoints, treshHoldScore){
        this.keypoints = {};
        _keypoints.forEach(({ score, part, position }) => {
            if (score >= treshHoldScore) this.keypoints[part] = position;
        });
        this.distance = null;
        this.headCenter = null;
        this.shoulderCenter = null;
        this.calibrate();
    };

    /**
     * Makes the system invariant to scale and translations,
     * given joints data
     */
    calibrate(){
        if (this.keypoints['leftEye'] && this.keypoints['rightEye']){

            const left_x = this.keypoints['leftEye'].x; 
            const left_y = this.keypoints['leftEye'].y; 
            const right_x = this.keypoints['rightEye'].x; 
            const right_y = this.keypoints['rightEye'].y;

            this.distance = Math.sqrt(Math.pow(left_x - right_x, 2) + Math.pow(left_y - right_y, 2));
            this.headCenter = {'x':(left_x + right_x) / 2.0, 'y':(left_y + right_y) / 2.0};
        }
        if (this.keypoints['leftShoulder'] && this.keypoints['rightShoulder']) {

            const left_x = this.keypoints['leftShoulder'].x;
            const left_y = this.keypoints['leftShoulder'].y;
            const right_x = this.keypoints['rightShoulder'].x;
            const right_y = this.keypoints['rightShoulder'].y;

            this.shoulderCenter = { 'x': (left_x + right_x) / 2.0, 'y': (left_y + right_y) / 2.0 };

            this.rotateJoint('leftShoulder', 'leftElbow', 'leftWrist');
            this.rotateJoint('rightShoulder', 'rightElbow', 'rightWrist');

            this.rotateJoint('leftElbow', 'leftShoulder', 'leftHip');
            this.rotateJoint('rightElbow', 'rightShoulder', 'rightHip');

            this.rotateJoint('rightHip', 'rightLeg', 'rightKnee');
            this.rotateJoint('leftHip', 'lefttLeg', 'leftKnee');

            this.rotateJoint('rightHip', 'rightKnee', 'lefttHip');
            this.rotateJoint('lefttHip', 'leftKnee', 'rightHip');
        }
    }

    /** Updates head joint data */
    head(){
        if(this.keypoints['nose'] && this.headCenter && this.shoulderCenter){
            var x = this.keypoints['nose'].x;
            var y = this.keypoints['nose'].y;
            // get nose relative points from origin
            x = (this.headCenter.x - x)/(this.distance/15);
            y = this.shoulderCenter.y - y;
            // normalize (i.e. scale it)
            y = this.map(y,this.distance*1.5,this.distance*2.8,-2,2);
            this.joints.update('head', { x, y });
            return { x, y };
        }
    }
    
    /**
     * Updates joints data and returns angle between three joints
     * @param {integer} jointA index of a joint
     * @param {intger} jointB index of a joint
     * @param {intger} jointC index of a joint
     * @returns {float} angle
     */
    rotateJoint(jointA, jointB, jointC){
        if (this.keypoints[jointA] && this.keypoints[jointB] && this.keypoints[jointC]){
            const angle = this.findAngle(this.keypoints[jointA], this.keypoints[jointB], this.keypoints[jointC]);
            const sign = (this.keypoints[jointC].y > this.keypoints[jointB].y) ? 1 : -1;
            this.joints.update(jointB, sign * angle);
            return angle;
        }
    }

    /** Maps from one linear interpolation into another one */
    map(original, in_min, in_max, out_min, out_max) {
        return (original - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    /**
     * Returns angle in radians given three points p1, p2, p3
     * @param {integer} p1 
     * @param {integer} p2
     * @param {integer} p3
     * @returns {float}
     */
    findAngle(p1,p2,p3){
        const p12 = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        const p13 = Math.sqrt(Math.pow((p1.x - p3.x), 2) + Math.pow((p1.y - p3.y), 2));
        const p23 = Math.sqrt(Math.pow((p2.x - p3.x), 2) + Math.pow((p2.y - p3.y), 2));
        const resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));
        return resultRadian;
    }

}