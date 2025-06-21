#  NetworkLogAnalyzer

**NetworkLogAnalyzer** is a browser-based tool that allows network engineers and IT professionals to analyze ping/traceroute log files in real-time. It extracts meaningful diagnostics such as response times, timeouts, and latency spikes — helping to troubleshoot connectivity issues quickly and effectively.

---

##  Features

-  **Parse ICMP logs** (e.g., `ping`, `tracert`)
-  **Identify the highest response time**
-  **Count responses between 2ms and 99ms**
-  **Detect and list all timeouts with timestamps**
-  **Filter responses above a customizable latency threshold**
-  **All processing is done in-browser — no backend required**

---

##  How to Use

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Upload your ping log file (`.txt` or `.log`).
4. View detailed analysis including:
   - Highest time
   - Count of time values in specific range
   - Timeout occurrences
   - Times exceeding selected threshold

---

##  Example Log Format

```text
2025-06-21 10:35:12.345 Reply from 192.168.1.1: bytes=32 time=15ms TTL=64
2025-06-21 10:35:14.567 Request timed out.
2025-06-21 10:35:16.123 Reply from 192.168.1.1: bytes=32 time=105ms TTL=64
