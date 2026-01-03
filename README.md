/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

# Sentinel: Living System Health Visualizer

Sentinel is a frontend system that visualizes system health as a living organism rather than a collection of charts and numbers. It translates abstract metrics into visceral biological metaphors.

## 1. Metaphor Rationale

Traditional dashboards overload users with raw data, requiring cognitive load to interpret. Sentinel bypasses this by appealing to our intuitive understanding of biological health.

- **Calmness** is instantly recognizable.
- **Stress** (heavy breathing, racing heart) provokes an empathetic response.
- **Sickness** (irregularity, feverish colors) signals danger without needing to read a number.

## 2. Mapping Logic

We map simulated system metrics to the organism's physiological state:

| System Metric | Biological Metaphor | Visual Manifestation                                     |
| ------------- | ------------------- | -------------------------------------------------------- |
| **CPU Load**  | Heartbeat Speed     | The central core pulses faster as load increases.        |
| **Memory**    | Breathing Depth     | The core expands/contracts more deeply as memory fills.  |
| **Errors**    | Muscle Tension      | High error rates cause the organism to shake and jitter. |
| **Network**   | Nervous System      | Particle flow accelerates with network traffic.          |

## 3. Why Visuals Replace Numbers

In high-pressure DevOps environments, "feeling" the system state is faster than reading it.

- **Peripheral Awareness**: You can monitor Sentinel out of the corner of your eye.
- **Reduced Anxiety**: Organic motion is less stressful than flashing red alert boxes.
- **Instant Triage**: If it looks "sick", it is sick.

## 4. Architecture

- `js/metric-simulator.js`: Generates mock data with realistic fluctuation and trends.
- `js/mapper.js`: Pure function transforming data -> visual state.
- `js/visual-engine.js`: HTML5 Canvas engine rendering the organism at 60fps.

## 5. Usage

Open `index.html` in any modern browser.

- **Normal Mode**: Watch the organism react to simulated stress.
- **Debug Mode**: Click "SHOW_DATA" to see the underlying raw numbers.


---

## 📜 Copyright & License

© 2026 Ashraf Morningstar. All Rights Reserved.

**Educational Disclaimer:** This is a personal recreation of an existing project concept, developed for learning and skill development purposes. The original project concept remains the intellectual property of its respective creator(s).

**License:** MIT License - See [LICENSE](./LICENSE) file for details.

**Developer:** [Ashraf Morningstar](https://github.com/AshrafMorningstar)

**Portfolio:** Explore more projects at [github.com/AshrafMorningstar](https://github.com/AshrafMorningstar)

---

### 🤝 Connect & Contribute

Found this helpful? Give it a ⭐️ on GitHub!

- 💼 Company: MORNINGSTARCONSTRUCTION
- 📍 Location: India
- 🐦 Twitter: [@AMS_Morningstar](https://twitter.com/AMS_Morningstar)
- 📧 Email: ashrafmorningstar@gmail.com
