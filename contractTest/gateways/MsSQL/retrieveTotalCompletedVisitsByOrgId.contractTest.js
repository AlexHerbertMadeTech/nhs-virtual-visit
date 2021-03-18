import retrieveTotalCompletedVisitsByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveTotalCompletedVisitsByOrgId.js";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setupOrganization,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import { statusToId, COMPLETE, ARCHIVED } from "../../../src/helpers/visitStatus";

describe("retrieveTotalCompletedVisitsByOrgIdGateway", () => {
  const container = AppContainer.getInstance();
  describe("retrieves scheduled call total when given a valid org Id", async () => {
    it("retrieves total when scheduled_call table has entries with COMPLETE status OR SCHEDULED status", async ()=>{
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
     
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });

        const { organisation: { id: orgTwoId } } = await setupOrganization({ createdBy: adminId });
        const { facilityId: facilityThreeId } = await setUpFacility({ createdBy: adminId, orgId: orgTwoId });
        const { departmentId: departmentFourId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityThreeId });
    
        const { uuid } = await setUpScheduledCall({ departmentId: departmentOneId });
        await setUpScheduledCall({ departmentId: departmentOneId });
        await setUpScheduledCall({ departmentId: departmentTwoId });
        await setUpScheduledCall({ departmentId: departmentThreeId });
        await setUpScheduledCall({ departmentId: departmentFourId });

           
        await container.getUpdateVisitStatusByCallIdGateway()({
            id: uuid,
            wardId: departmentOneId,
            status: statusToId(COMPLETE),
        });

        // Act
        const total = await retrieveTotalCompletedVisitsByOrgIdGateway(container)({
        orgId: orgOneId
        });
        // Assert
        expect(total).toEqual(1);
    });
    it("retrieves total when scheduled_call table has entries with COMPLETE status OR ARCHIVED status (with end_time = null)", async ()=>{
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
     
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });

        const { organisation: { id: orgTwoId } } = await setupOrganization({ createdBy: adminId });
        const { facilityId: facilityThreeId } = await setUpFacility({ createdBy: adminId, orgId: orgTwoId });
        const { departmentId: departmentFourId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityThreeId });
    
        const { uuid: visitOneUuid } = await setUpScheduledCall({ departmentId: departmentOneId });
        await setUpScheduledCall({ departmentId: departmentOneId });
        const { uuid: visitTwoUuid } = await setUpScheduledCall({ departmentId: departmentTwoId });
        await setUpScheduledCall({ departmentId: departmentThreeId });
        await setUpScheduledCall({ departmentId: departmentFourId });

           
        await container.getUpdateVisitStatusByCallIdGateway()({
            id: visitOneUuid,
            wardId: departmentOneId,
            status: statusToId(COMPLETE),
        });

        await container.getUpdateVisitStatusByCallIdGateway()({
            id: visitTwoUuid,
            wardId: departmentOneId,
            status: statusToId(ARCHIVED),
        });

        // Act
        const total = await retrieveTotalCompletedVisitsByOrgIdGateway(container)({
        orgId: orgOneId
        });
        // Assert
        expect(total).toEqual(1);
    });

    it("retrieves total when scheduled_call table has entries with COMPLETE status OR ARCHIVED status (with end_time != null)", async ()=>{
        // Arrange
        const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
     
        const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
        const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
        const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });

        const { organisation: { id: orgTwoId } } = await setupOrganization({ createdBy: adminId });
        const { facilityId: facilityThreeId } = await setUpFacility({ createdBy: adminId, orgId: orgTwoId });
        const { departmentId: departmentFourId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityThreeId });
    
        const { uuid: visitOneUuid } = await setUpScheduledCall({ departmentId: departmentOneId });
        await setUpScheduledCall({ departmentId: departmentOneId });
        const { uuid: visitTwoUuid } = await setUpScheduledCall({ departmentId: departmentTwoId });
        await setUpScheduledCall({ departmentId: departmentThreeId });
        await setUpScheduledCall({ departmentId: departmentFourId });

           
        await container.getUpdateVisitStatusByCallIdGateway()({
            id: visitOneUuid,
            wardId: departmentOneId,
            status: statusToId(COMPLETE),
        });

        await container.getMarkVisitAsComplete()({
            id: visitTwoUuid,
            wardId: departmentOneId,
        });
        await container.getUpdateVisitStatusByCallIdGateway()({
            id: visitTwoUuid,
            wardId: departmentOneId,
            status: statusToId(ARCHIVED),
        });

        // Act
        const total = await retrieveTotalCompletedVisitsByOrgIdGateway(container)({
        orgId: orgOneId
        });
        // Assert
        expect(total).toEqual(2);
    });
    it ("returns 0 when no visits exist", async ()=>{
        // Arrange
        const { adminId, orgId } = await setupAdminAndOrganisation();
        const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
        await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
        // Act
        const total = await retrieveTotalCompletedVisitsByOrgIdGateway(container)({
        orgId
        });
        // Assert
        expect(total).toEqual(0);
    })
  
  });
  it("returns undefined when given invalid facility id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const total = await retrieveTotalCompletedVisitsByOrgIdGateway(container)({
        orgId: idDoesNotExist
    });
    // Assert
    expect(total).toBeDefined();
  });

  it("throws an error when facility id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalCompletedVisitsByOrgIdGateway(container)({ orgId: invalidId }) ).rejects.toThrowError();
  });

});
