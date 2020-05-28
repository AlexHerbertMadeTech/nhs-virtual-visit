const retrieveVisitByCallId = ({ getDb }) => async (callId) => {
  const db = await getDb();
  console.log("Retrieving visit for  ", callId);
  try {
    const scheduledCalls = await db.any(
      `SELECT * FROM scheduled_calls_table WHERE call_id = $1 LIMIT 1`,
      callId
    );

    const scheduledCall = scheduledCalls[0];

    return {
      scheduledCall: {
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
        recipientName: scheduledCall.recipient_name,
        recipientNumber: scheduledCall.recipient_number,
        recipientEmail: scheduledCall.recipient_email,
        callTime: scheduledCall.call_time
          ? scheduledCall.call_time.toISOString()
          : null,
        callId: scheduledCall.call_id,
        provider: scheduledCall.provider,
        callPassword: scheduledCall.call_password,
      },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      scheduledCalls: null,
      error: error.toString(),
    };
  }
};

export default retrieveVisitByCallId;
