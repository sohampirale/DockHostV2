import Backend from "../models/backend.model.js";
async function giveRamdomPorts(backendId) {
    try {
        const backend = await Backend.findById(backendId);
        if (!backend)
            return null;
        let portNo = backend.portNo;
        const allocatedPorts = backend.allocatedPorts;
        while (1) {
            if (allocatedPorts.includes(portNo) || allocatedPorts.includes(portNo + 1) || allocatedPorts.includes(portNo + 2)) {
                portNo += 3;
            }
            else
                break;
        }
        return portNo;
    }
    catch (error) {
        return null;
    }
}
export default giveRamdomPorts;
//# sourceMappingURL=giveRandomPort.js.map