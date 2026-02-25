Implement a Surplus Early Alert system.

Trigger Condition:
- If surplus food is not fully reserved
- AND remaining time to expiry is 1 hour
- Automatically trigger an Early Alert

Alert Logic:
1. Identify nearest verified NGOs within 5km using geo-distance calculation.
2. Send real-time notification to those NGOs.
3. Display the alert in a separate section called "Surplus Early Alerts" on the NGO dashboard.
4. Show:
   - Provider name
   - Food item
   - Remaining quantity
   - Time left before expiry
   - Distance from NGO
5. Include a "Request Pickup" button.
6. When clicked:
   - Lock remaining quantity
   - Mark status as "Reserved by NGO"
   - Notify provider immediately.
7. Auto-remove alert once food expires or is fully reserved.

Ensure:
- No duplicate NGO claims.
- Real-time updates.
- Clean and scalable implementation.