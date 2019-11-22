import * as BABYLON from 'babylonjs';

/**
 * GraphicsEngine class for running BabylonJS
 * and rendering 3D rigged character on it
 */
export default class GraphicsEngine {
    /**
     * the class constructor
     * @param {HTMLCanvasElement} _canvas 
     * @param {Joints} _joints 
     */
    constructor(_canvas, _joints, _updateState){
        this.canvas = _canvas;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.displayLoadingUI();
        this.engine.loadingUIText = "Bablyon 3D Loading ...";
        this.joints = _joints;
        this.initScene();
        this.engine.hideLoadingUI();
        this.updateState = _updateState;
    }

    /**
     * Initialez the scene, creates the character
     * and defines how should joints of the character be updated
     */
    initScene(){
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);

        this.scene.clearColor = new BABYLON.Color3(0.75,0.75,0.75);
        this.scene.ambientColor = new BABYLON.Color3(1,1,1);
        this.setCamera();
        const sphere = BABYLON.MeshBuilder.CreateSphere('', { diameter: .0001 }, this.scene);
        const option = "dude";
        let path;
        let file;
        switch(option){
            case "oldman":
                path = "./Scenes/OldMan/";
                file = "oldman.babylon";
                break;
            case "dude":
                path = "./Scenes/Dude/";
                file = "Dude.babylon";
                break;
            case "vincent":
                path = "./Scenes/Vincent/";
                file = "Vincent.babylon";
                break;
            case "sinon":
                path = "./Scenes/Sinon/";
                file = "Sinon.babylon";
                break;
            default:
                path = "./Scenes/Dude/";
                file = "Dude.babylon";
                break;
        }

        BABYLON.SceneLoader.ImportMesh("", path, file, this.scene, (newMeshes, particleSystems, skeletons) => {
            const mesh = newMeshes[0];
            const skeleton = skeletons[0];
            mesh.scaling = new BABYLON.Vector3(.1,.1, .1);
            mesh.position = new BABYLON.Vector3(0, 0, 0);

            let head_bone;
            let right_shoulder_bone;
            let right_arm_bone;
            let left_shoulder_bone;
            let left_arm_bone;
            switch(option){
                case "oldman":
                    head_bone = skeleton.bones[3];
                    right_shoulder_bone = skeleton.bones[6];
                    right_arm_bone = skeleton.bones[7];
                    left_shoulder_bone = skeleton.bones[15];
                    left_arm_bone = skeleton.bones[16];
                    break;
                case "dude":
                    head_bone = skeleton.bones[7];
                    right_shoulder_bone = skeleton.bones[13];
                    right_arm_bone = skeleton.bones[14];
                    left_shoulder_bone = skeleton.bones[32];
                    left_arm_bone = skeleton.bones[33];
                    break;
                case "vincent":
                    head_bone = skeleton.bones[3];
                    right_shoulder_bone = skeleton.bones[6];
                    right_arm_bone = skeleton.bones[7];
                    left_shoulder_bone = skeleton.bones[15];
                    left_arm_bone = skeleton.bones[16];
                    break;
                default:
                    head_bone = skeleton.bones[6];
                    right_shoulder_bone = skeleton.bones[13];
                    right_arm_bone = skeleton.bones[14];
                    left_shoulder_bone = skeleton.bones[32];
                    left_arm_bone = skeleton.bones[33];
                    break;
            }

            console.log(skeleton.bones);

            const lookAtCtl = new BABYLON.BoneLookController(mesh, head_bone, sphere.position, { adjustYaw: Math.PI * .5, adjustRoll: Math.PI * .5 });

            this.scene.registerBeforeRender(() => {
                const { data } = this.joints;
                if(option!=="oldman"){                   
                    sphere.position.x = 0 + data.head.x;
                    sphere.position.y = 6 + data.head.y;
                    sphere.position.z = 5;
    
                    const bias1 = 2.8;
                    const bias2 = 0;
                    right_shoulder_bone.rotation = new BABYLON.Vector3(0, 1.5 * (data.rightShoulder + bias1), 0);
                    right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow + bias2, 0);
                    left_shoulder_bone.rotation = new BABYLON.Vector3(0, -1.5 * (data.leftShoulder + bias1), 0);
                    left_arm_bone.rotation = new BABYLON.Vector3(0, (-data.leftElbow - bias2), 0);

                }
    
                if(data.bones[data.currentBone]){
                    skeleton.bones[data.currentBone].rotation = new BABYLON.Vector3(0, data.bones[data.currentBone], 0);
                }

                lookAtCtl.update();

                const time = (new Date()).getTime();
                this.updateState(time);
            });
        });
    };

    /** BabylonJS render function that is called every frame */
    render(){
        this.engine.runRenderLoop(() => {
            const self = this;
            if(self.scene) self.scene.render();
        });
    }

    /** Sets up 3d virtual cam for the scene */
    setCamera(){
        const camera = new BABYLON.ArcRotateCamera("camera", 0, 1, 20, BABYLON.Vector3.Zero(), this.scene);
        camera.setTarget(new BABYLON.Vector3(0, 4, 0));
        camera.setPosition(new BABYLON.Vector3(0, 5, 11))
        camera.attachControl(this.canvas, true);
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        return camera;
    }

}