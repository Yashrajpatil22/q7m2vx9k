from services.elexon import fetch_actual_wind_generation

records = fetch_actual_wind_generation()

start_times = [record["startTime"] for record in records]
generations = [record.get("generation") for record in records]

print(f"Total records: {len(records)}")
print(f"Unique start times: {len(set(start_times))}")
print(f"Earliest start time: {min(start_times)}")
print(f"Latest start time: {max(start_times)}")
print(f"Missing generation values: {sum(v is None for v in generations)}")
print(f"Non-WIND records: {sum(r.get('fuelType') != 'WIND' for r in records)}")