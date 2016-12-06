var SLV = {};
SLV.Model = {};
SLV.Model.Equipment = {};
SLV.Model.Equipment.Type = {};


SLV.Plugin = function () {
    this.userContext = {
        serviceAddress: {
            protocol: 'http:',
            host: 'gbuzogany.freeboxos.fr',
            port: '51338',
            path: 'reports/'
        }
    }
};

SLV.Model.Equipment.Type.DEFAULT = 'device';
SLV.Model.Equipment.Type.STREETLIGHT = 'streetlight';
SLV.Model.Equipment.Type.SWITCH = 'switch';
SLV.Model.Equipment.Type.CAMERA = 'cameraip';
SLV.Model.Equipment.Type.CONTROLLER = 'controllerdevice';
SLV.Model.Equipment.Type.ELECTRICALCOUNTER = 'electricalCounter';
SLV.Model.Equipment.Type.VEHICLECHARGINGSTATION = 'vehicleChargingStation';
SLV.Model.Equipment.Type.ENVIRONMENTALSENSOR = 'envSensor';
SLV.Model.Equipment.Type.INPUT = 'input';
SLV.Model.Equipment.Type.OUTPUT = 'output';
SLV.Model.Equipment.Type.NATURE = 'nature';
SLV.Model.Equipment.Type.TANK = 'tank';
SLV.Model.Equipment.Type.CITYOBJECT = 'cityObject';
SLV.Model.Equipment.Type.TRANSPORTSIGNAGE = 'transportSignage';
SLV.Model.Equipment.Type.BUILDING = 'building';
SLV.Model.Equipment.Type.AUDIOPLAYER = 'audioPlayer';
SLV.Model.Equipment.Type.WEATHERSTATION = 'weatherStation';
SLV.Model.Equipment.Type.OCCUPANCYSENSOR = 'occupancySensor';
SLV.Model.Equipment.Type.WASTECONTAINER = 'wasteContainer';
SLV.Model.Equipment.Type.PARKINGPLACE = 'parkingPlace';
SLV.Model.Equipment.Type.NETWORKCOMPONENT = 'networkComponent';
SLV.Model.Equipment.Type.VEHICLE = 'vehicle';