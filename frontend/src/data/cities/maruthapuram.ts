import type { City, SolutionQuestion } from '@/types'

/** Shared five-question framework used by every problem quiz. */
function solutionQuiz(
  approach: Omit<SolutionQuestion, 'id'>,
  customer: Omit<SolutionQuestion, 'id'>,
  revenue: Omit<SolutionQuestion, 'id'>,
  pricing: Omit<SolutionQuestion, 'id'>,
  edge: Omit<SolutionQuestion, 'id'>,
): SolutionQuestion[] {
  return [
    { id: 'approach', ...approach },
    { id: 'customer', ...customer },
    { id: 'revenue', ...revenue },
    { id: 'pricing', ...pricing },
    { id: 'edge', ...edge },
  ]
}

export const maruthapuram: City = {
  id: 'maruthapuram',
  name: 'Maruthapuram',
  description:
    'A fast-growing metropolitan city where IT parks, multi-specialty hospitals, and government offices sit beside some of the worst peak-hour traffic in the state. Startups here solve problems at urban scale.',
  backgroundImage: '/assets/cities/maruthapuram_bg.png',
  categoryImage: '/assets/cities/maruthapuram_cat.png',
  categories: [
    {
      name: 'Mobility & Transport',
      icon: '/assets/category-icons/transport.png',
      problems: [
        {
          id: 'traffic-congestion',
          name: 'Traffic Congestion',
          description:
            'Peak-hour gridlock on OMR, GST Road, and inner-city flyovers costs commuters hours daily and bleeds productivity from Maruthapuram\'s office corridors.',
          difficulty: 4,
          opportunitySize: 5,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to reducing traffic congestion?',
              options: [
                'AI signal timing using live camera and GPS feeds across 200 junctions',
                'Employer-led staggered shift scheduling tied to a city mobility portal',
                'Congestion pricing zones with FASTag-linked entry fees in the CBD',
                'Real-time route rewards app that nudges drivers off saturated corridors',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Maruthapuram Municipal Corporation transport wing',
                'IT parks and SEZ facility managers on OMR',
                'Daily car commuters paying for premium route guidance',
                'State transport department planning cell',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Annual SaaS license per junction zone to the city corporation',
                'B2B subscription sold to tech parks per employee headcount',
                'Freemium commuter app with paid premium routing',
                'Performance bonus contract tied to measured congestion reduction',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹18 lakh/year per 50-junction zone (government tier)',
                '₹45/employee/month for campus mobility packages',
                '₹199/month for commuter premium subscriptions',
                '₹2 crore outcome-based contract over three years',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Integrates with existing Chennai-style CCTV and police control room feeds',
                'Tamil voice alerts for auto and bus drivers via loudspeaker APIs',
                'Works offline at junction boxes when fiber links fail during monsoon',
                'Open data dashboard so journalists can audit congestion claims',
              ],
            },
          ),
        },
        {
          id: 'smart-parking',
          name: 'Smart Parking System',
          description:
            'Drivers circle blocks around T Nagar and hospital districts hunting for parking while illegal occupancy and poor signage make curb space impossible to manage.',
          difficulty: 3,
          opportunitySize: 4,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to smart parking?',
              options: [
                'IoT occupancy sensors in paid lots with live vacancy maps',
                'ML plate recognition to penalize overstays on public streets',
                'Pre-bookable mall and hospital parking slots via UPI deposit',
                'Dynamic pricing that raises rates when occupancy crosses 85%',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Private mall and hospital parking operators',
                'Maruthapuram Municipal Corporation parking department',
                'Daily commuters near railway station hubs',
                'Commercial building owners with basement lots',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Revenue share on each UPI parking transaction',
                'Hardware lease plus monthly SaaS per lot',
                'Monthly subscription for guaranteed slot reservations',
                'Fine-processing fee on automated penalty notices',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '8% transaction fee on UPI parking payments',
                '₹6,500/month per 100-slot lot plus sensor install',
                '₹49/month commuter reserve plan',
                '₹25 per automated penalty processed',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Tamil and English signage templates for ward-level operators',
                'Integrates with existing FASTag and Paytm QR at lot exits',
                'Hospital emergency lane override so ambulances never get blocked',
                'Works with low-cost magnetic sensors when CCTV is unavailable',
              ],
            },
          ),
        },
        {
          id: 'last-mile-transit',
          name: 'Last-Mile Transit',
          description:
            'Metro and suburban rail drop commuters kilometers from offices and campuses; auto fares spike and shared mobility is fragmented across the city.',
          difficulty: 3,
          opportunitySize: 4,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to last-mile transit?',
              options: [
                'Electric shuttle loops between metro stations and IT parks',
                'Auto-rickshaw fleet aggregator with fixed slab fares per corridor',
                'Corporate bus pooling matched by shift timing and route AI',
                'Shared e-scooter hubs with geofenced parking at station exits',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'IT parks needing employee last-mile contracts',
                'Metro rail operator seeking feeder service partners',
                'Daily commuters exiting Guindy and Tambaram stations',
                'Auto union cooperatives wanting digitized dispatch',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Per-seat corporate shuttle contracts billed monthly',
                'Commission on each auto or scooter ride booked',
                'Advertising on in-shuttle screens and app home feed',
                'Station kiosk rental fee from metro authority',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹3,200/seat/month on OMR shuttle loops',
                '12% commission per ride under ₹150',
                '₹8 lakh/year per station for branded kiosk rights',
                '₹15/ride flat for pooled auto bookings',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Guaranteed seat for women commuters on night shifts',
                'Tamil SMS booking for passengers without smartphones',
                'Live metro arrival sync so shuttles wait for delayed trains',
                'Union-approved fare tables so auto drivers do not undercut',
              ],
            },
          ),
        },
      ],
    },
    {
      name: 'Environment',
      icon: '/assets/category-icons/environment.png',
      problems: [
        {
          id: 'air-pollution',
          name: 'Air Pollution',
          description:
            'AQI spikes from vehicular exhaust, construction dust, and festival-season burning choke Maruthapuram\'s dense wards and trigger health emergencies.',
          difficulty: 4,
          opportunitySize: 4,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to tackling air pollution?',
              options: [
                'Low-cost sensor network with ward-level AQI heat maps',
                'Construction site dust compliance scoring via drone imagery',
                'Industrial stack monitoring linked to TNPCB reporting formats',
                'Citizen complaint app that triggers rapid response teams',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Tamil Nadu Pollution Control Board regional office',
                'Maruthapuram Municipal Corporation health wing',
                'Schools and hospitals needing localized AQI alerts',
                'Construction firms requiring compliance dashboards',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Government annual monitoring contract per ward cluster',
                'SaaS subscription for schools and hospitals',
                'Compliance audit fees for construction developers',
                'CSR-funded sensor deployment in low-income wards',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹12 lakh/year per 10-ward sensor cluster',
                '₹2,500/month per school or clinic site',
                '₹75,000 per construction project audit season',
                '₹8 lakh CSR package for 5 ward deployments',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Calibrated for Tamil Nadu humidity and monsoon interference',
                'SMS alerts in Tamil when AQI crosses 200 near schools',
                'Exports data in TNPCB-approved CSV formats automatically',
                'Open API so news channels can embed live ward AQI widgets',
              ],
            },
          ),
        },
        {
          id: 'urban-flood-monitoring',
          name: 'Urban Flood Monitoring',
          description:
            'Short cloudbursts turn underpasses and canal-adjacent roads into rivers; residents need early warnings before commute windows close.',
          difficulty: 3,
          opportunitySize: 3,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to urban flood monitoring?',
              options: [
                'Ultrasonic level sensors in storm drains and underpasses',
                'Crowdsourced waterlogging reports verified by ward volunteers',
                'IMD rainfall feed fused with local canal gate status data',
                'Predictive model using tank and lake outflow telemetry',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Maruthapuram disaster management cell',
                'Residential welfare associations in flood-prone wards',
                'Commuters relying on Google Maps alternatives during rains',
                'Municipal stormwater engineering department',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'City disaster management annual service contract',
                'Subscription for apartment associations per gate',
                'Freemium app with sponsored alerts from insurers',
                'Consulting fee on sensor placement studies',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹25 lakh/year for city-wide alert platform',
                '₹800/month per apartment association',
                '₹99/monsoon season family alert plan',
                '₹5 lakh one-time hydrology mapping study',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Push alerts 45 minutes before known choke underpasses flood',
                'Integrates with PWD canal gate operators via WhatsApp bots',
                'Tamil voice calls to elderly residents in low-lying lanes',
                'Offline mesh relays when mobile towers fail in storms',
              ],
            },
          ),
        },
        {
          id: 'plastic-waste-management',
          name: 'Plastic Waste Management',
          description:
            'Single-use plastic fills market streets and canal banks despite ban enforcement; ragpickers lack traceability and fair pricing for segregated waste.',
          difficulty: 2,
          opportunitySize: 3,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to plastic waste management?',
              options: [
                'QR-coded bin routes with ragpicker collection incentives via UPI',
                'Reverse vending machines at bus stands and markets',
                'Bulk pickup contracts for hotels and wedding halls',
                'Plastic credit ledger tying shops to certified recyclers',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Municipal solid waste contractors in zone 4 and 7',
                'Ragpicker cooperatives needing fair daily rates',
                'Hotels and caterers with high disposable plastic use',
                'Supermarkets participating in extended producer responsibility',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Fee per ton of traceable plastic delivered to recyclers',
                'Machine placement advertising and deposit handling fees',
                'Monthly pickup subscription for commercial kitchens',
                'EPR compliance reporting sold to brand owners',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹1,200/ton platform fee on verified plastic deliveries',
                '₹3 per bottle deposit processed at vending machines',
                '₹4,500/month for hotel bulk pickup (up to 200 kg)',
                '₹2 lakh/year EPR dashboard for mid-size brands',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Same-day UPI payout to ragpickers when segregation quality passes',
                'Tamil voice onboarding for informal waste workers',
                'GPS proof-of-collection photos for municipal audit trails',
                'Partnership with existing Amma Unavagam bin routes',
              ],
            },
          ),
        },
      ],
    },
    {
      name: 'Healthcare',
      icon: '/assets/category-icons/hospitals.png',
      problems: [
        {
          id: 'digital-health-records',
          name: 'Digital Health Records',
          description:
            'Patients carry paper files between clinics, labs, and hospitals; duplicate tests and lost histories slow care across Maruthapuram\'s crowded OPD wards.',
          difficulty: 3,
          opportunitySize: 5,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to digital health records?',
              options: [
                'ABHA-linked unified patient record across clinics and labs',
                'Clinic-first EMR with e-prescription and lab order integration',
                'Hospital chain integration hub for referral and discharge summaries',
                'Patient-owned PHR app where citizens upload and share records',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Private multi-specialty clinics with 5–20 doctors',
                'Government primary health centres upgrading under NHM',
                'Corporate employers offering employee health benefits',
                'Elderly patients managing chronic conditions across providers',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Monthly SaaS subscription per clinic location',
                'Per-visit transaction fee on OPD registrations',
                'Annual enterprise license for hospital chains',
                'Freemium patient app with paid family record sharing',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹999/month per clinic (up to 3 doctors)',
                '₹5 per OPD visit processed through the platform',
                '₹50 lakh/year for 10-hospital chain deployment',
                '₹149/month family plan for patient PHR access',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Tamil and English UI with voice readout for low-literacy patients',
                'Offline-first sync for clinics with unreliable broadband',
                'ABDM-compliant health ID linking out of the box',
                'FHIR export so patients can move records between any hospital',
              ],
            },
          ),
        },
        {
          id: 'ambulance-dispatch',
          name: 'Ambulance Dispatch',
          description:
            'Emergency callers struggle to locate the nearest free ambulance; private fleets and 108 services operate on disconnected phone chains during golden hour.',
          difficulty: 3,
          opportunitySize: 4,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to ambulance dispatch?',
              options: [
                'GPS fleet dashboard that routes the nearest available unit',
                'Uber-style aggregator connecting private ambulances to hospitals',
                '108 call-center upgrade with automatic hospital pre-alert',
                'Community first-responder network with trained volunteers',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Private ambulance operators with 5–50 vehicles',
                'Multi-specialty hospitals managing inbound emergencies',
                'State 108 service seeking dispatch optimization',
                'Apartment associations buying bulk emergency subscriptions',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Monthly SaaS per ambulance plus per-dispatch fee',
                'Commission on each completed emergency trip',
                'Hospital retainer for guaranteed response SLAs',
                'Annual license for 108 control room integration',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹1,500/ambulance/month plus ₹150 per dispatch',
                '15% commission on trips billed above ₹2,000',
                '₹3 lakh/month hospital SLA for sub-12-minute arrival',
                '₹40 lakh/year for 108 control room module',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Auto-shares patient location and vitals with ER before arrival',
                'Tamil IVR for callers who cannot describe landmarks clearly',
                'Integrates with Google Maps plus local alleyway shortcuts database',
                'Shows real-time traffic on GST Road and OMR flyovers',
              ],
            },
          ),
        },
        {
          id: 'elderly-care-services',
          name: 'Elderly Care Services',
          description:
            'Aging residents in Maruthapuram\'s apartment blocks need medication reminders, home nursing, and companionship while adult children work long IT shifts.',
          difficulty: 2,
          opportunitySize: 3,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to elderly care services?',
              options: [
                'Subscription home visits by verified nurses and attendants',
                'Telehealth check-ins with family dashboard and pill reminders',
                'Senior activity center shuttle plus day-care social programs',
                'Emergency pendant linked to neighborhood responder network',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Adult children abroad sponsoring care for parents in Maruthapuram',
                'Apartment associations with high retiree populations',
                'Geriatric clinics referring patients for home follow-up',
                'Elderly couples living independently in owned flats',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Monthly care plan bundles (visits + telehealth)',
                'Per-visit fee for nursing and attendant hours',
                'Day-care center daily pass plus transport add-on',
                'Hardware pendant sold once plus low monthly monitoring fee',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹8,500/month basic plan (4 home visits + telehealth)',
                '₹650 per attendant hour for overnight care',
                '₹450/day day-care pass including lunch and activities',
                '₹2,999 pendant kit plus ₹299/month monitoring',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Background-verified attendants with Tamil and Hindi fluency',
                'Family WhatsApp updates with visit photos and vitals log',
                'Partnership with nearby pharmacies for medicine delivery',
                'Coordination with elderly patients\' existing hospital doctors',
              ],
            },
          ),
        },
      ],
    },
    {
      name: 'Food & Commerce',
      icon: '/assets/category-icons/food.png',
      problems: [
        {
          id: 'food-waste-reduction',
          name: 'Food Waste Reduction',
          description:
            'Hotels, canteens, and wedding caterers dump surplus meals nightly while shelters and low-income wards lack a reliable pickup network.',
          difficulty: 2,
          opportunitySize: 3,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to reducing food waste?',
              options: [
                'Surplus meal pickup app matching donors to NGOs within 45 minutes',
                'Smart bin sensors that forecast waste before banquets end',
                'Tax-credit linked donation ledger for corporate canteens',
                'Discount marketplace selling same-day unsold restaurant meals',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Three-star hotels and wedding halls with nightly surplus',
                'IT park canteen operators serving 2,000+ meals daily',
                'NGOs and community kitchens feeding low-income wards',
                'Budget-conscious students and workers buying discounted meals',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Subscription for commercial kitchens plus logistics fee per pickup',
                'Commission on discounted meal sales through the app',
                'CSR reporting package sold to corporate donors',
                'Municipal contract for landfill diversion metrics',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹5,000/month kitchen subscription plus ₹80/pickup run',
                '20% commission on meals sold under ₹120',
                '₹1.5 lakh/year CSR impact dashboard for enterprises',
                '₹18 lakh/year municipal diversion reporting contract',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'FSSAI-compliant cold-chain checklist on every pickup run',
                'Tamil SMS alerts to NGOs when large wedding surplus posts',
                'Same-night tax donation receipt for corporate canteens',
                'Heat-map showing wards with highest unserved meal demand',
              ],
            },
          ),
        },
        {
          id: 'restaurant-delivery-network',
          name: 'Restaurant Delivery Network',
          description:
            'Independent restaurants on Maruthapuram\'s food streets pay crushing aggregator commissions; delivery reliability drops during monsoon floods.',
          difficulty: 4,
          opportunitySize: 5,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to a restaurant delivery network?',
              options: [
                'Co-op delivery fleet owned by participating restaurants',
                'White-label delivery SaaS with restaurant-branded rider apps',
                'Hyperlocal cloud kitchen hub sharing one delivery pool',
                'Slab-rate aggregator with capped 12% commission contract',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Independent restaurants on Mint Street and Besant Nagar food corridors',
                'Restaurant associations wanting collective bargaining power',
                'Cloud kitchen operators without own delivery staff',
                'Customers ordering Tamil Nadu cuisine from neighborhood gems',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Flat monthly SaaS plus lower per-order delivery fee',
                'Co-op profit share after rider costs are covered',
                'Commission capped below national aggregator rates',
                'Delivery-as-a-service hourly rider rental to restaurants',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹2,500/month SaaS plus ₹25 per delivery',
                '8% co-op revenue share on orders above ₹200',
                'Maximum 12% all-in commission per order',
                '₹120/hour per dedicated rider during lunch peak',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Restaurants keep customer data and can run own WhatsApp promos',
                'Monsoon mode reroutes around flooded Adyar and canal roads',
                'Tamil menu support for non-English kitchen staff',
                'Same-day UPI settlement instead of weekly aggregator payouts',
              ],
            },
          ),
        },
        {
          id: 'local-grocery-marketplace',
          name: 'Local Grocery Marketplace',
          description:
            'Neighborhood provision stores lose sales to quick-commerce dark stores; elderly customers want trusted local billing with home delivery.',
          difficulty: 3,
          opportunitySize: 4,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to a local grocery marketplace?',
              options: [
                'Digitize existing kirana inventory with same-store pickup and delivery',
                'Cluster 20 neighborhood stores under one citywide delivery brand',
                'WhatsApp catalog bot with UPI payment for non-smartphone shoppers',
                'Subscription vegetable basket sourced daily from Koyambedu wholesale',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Family-run kirana stores on residential street corners',
                'Apartment residents wanting 60-minute grocery delivery',
                'Elderly customers loyal to their neighborhood store owner',
                'Working couples ordering weekly staples in bulk',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'SaaS billing tool plus small fee per online order',
                'Delivery fee split between platform and store',
                'Wholesale margin on subscription vegetable baskets',
                'In-app brand promotions from FMCG companies',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹499/month store SaaS plus ₹8 per online order',
                '₹35 flat delivery fee (₹15 to store, ₹20 to platform)',
                '₹599/week subscription basket for family of four',
                '₹5,000/month FMCG featured shelf placement per ward',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Store owner still knows customer by name — not anonymous dark store',
                'Tamil voice ordering for elderly via missed-call callback',
                'Credit khata ledger preserved digitally for trusted regulars',
                'Same-day replacement if Koyambedu quality batch is poor',
              ],
            },
          ),
        },
      ],
    },
    {
      name: 'Smart Civic Services',
      icon: '/assets/category-icons/smart-civics.png',
      problems: [
        {
          id: 'digital-citizen-services',
          name: 'Digital Citizen Services',
          description:
            'Birth certificates, property tax, and trade licenses still require multiple ward office visits; queues stretch outside corporation buildings daily.',
          difficulty: 4,
          opportunitySize: 4,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to digital citizen services?',
              options: [
                'Unified e-seva portal wrapping existing corporation workflows',
                'Ward-level kiosk assistants helping citizens file online',
                'WhatsApp chatbot for status tracking on pending applications',
                'API middleware connecting TNeGA services to a simpler city UI',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Maruthapuram Municipal Corporation e-governance cell',
                'Citizens applying for certificates and licenses',
                'Ward office assistants handling walk-in traffic',
                'Small businesses renewing trade licenses annually',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Implementation and maintenance contract with the corporation',
                'Convenience fee on select citizen transactions',
                'Kiosk operator franchise fee per ward',
                'Training and change-management package for ward staff',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹1.2 crore/year platform maintenance for the corporation',
                '₹25 convenience fee on expedited certificate requests',
                '₹40,000/year per ward kiosk franchise license',
                '₹8 lakh staff training package over six months',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Tamil-first forms with English toggle for legal fields',
                'SMS status updates when files move between ward desks',
                'Works on 2G phones via missed-call application lookup',
                'Audit trail showing which clerk delayed each application',
              ],
            },
          ),
        },
        {
          id: 'public-complaint-portal',
          name: 'Public Complaint Portal',
          description:
            'Potholes, broken streetlights, and garbage dumps stay unresolved for weeks because complaints disappear into paper registers at ward offices.',
          difficulty: 2,
          opportunitySize: 3,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to a public complaint portal?',
              options: [
                'Geo-tagged photo complaints routed to ward engineers with SLA timers',
                'WhatsApp bot accepting voice notes and location pins',
                'Ward councillor dashboard ranking unresolved issues publicly',
                'Integration with existing corporation helpline ticket numbers',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Maruthapuram Municipal Corporation grievance cell',
                'Residents in wards 12–45 with chronic infrastructure neglect',
                'Ward councillors facing re-election accountability pressure',
                'Local newspapers monitoring civic issue resolution rates',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Annual SaaS license to the corporation per ward',
                'Freemium citizen app with civic NGO sponsorship',
                'Performance analytics sold to urban policy think tanks',
                'Advertising from local contractors on resolved issue pages',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹4,500/month per ward for SLA tracking dashboard',
                'Free citizen app; ₹6 lakh/year NGO citywide sponsorship',
                '₹3 lakh/year analytics export for research partners',
                '₹2,000/month featured contractor slot per ward page',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Public resolution leaderboard so councillors cannot hide delays',
                'Tamil voice complaint upload for residents who cannot type',
                'Before/after photo proof required before ticket closure',
                'Auto-escalation to regional commissioner after 14-day SLA breach',
              ],
            },
          ),
        },
        {
          id: 'smart-street-monitoring',
          name: 'Smart Street Monitoring',
          description:
            'Broken streetlights, open manholes, and illegal dumping go unreported until accidents happen; ward inspectors cannot cover every lane daily.',
          difficulty: 3,
          opportunitySize: 3,
          questions: solutionQuiz(
            {
              prompt: 'What is your core approach to smart street monitoring?',
              options: [
                'IoT streetlight controllers reporting outages automatically',
                'Citizen photo patrol gamification with ward-level scoreboards',
                'Municipal vehicle-mounted cameras scanning road surface defects',
                'Sensor mesh detecting manhole cover displacement and water pooling',
              ],
            },
            {
              prompt: 'Who is your primary target customer?',
              options: [
                'Municipal electrical department managing 80,000 streetlights',
                'Road maintenance contractors paid on defect response time',
                'Residents in poorly lit lanes near schools and bus stops',
                'Smart city project office reporting KPIs to state government',
              ],
            },
            {
              prompt: 'What is your revenue model?',
              options: [
                'Per-pole IoT device lease plus monitoring SaaS',
                'Outcome contract tied to reduced outage response time',
                'Citizen app free; corporation pays for aggregated issue maps',
                'Data licensing for insurers assessing street risk zones',
              ],
            },
            {
              prompt: 'What is your pricing tier?',
              options: [
                '₹180/pole/year IoT lease plus ₹9 lakh city dashboard',
                '₹50 lakh/year if average outage fix drops below 36 hours',
                '₹15 lakh/year civic issue heat-map for corporation',
                '₹2 lakh/year ward risk data for insurance partners',
              ],
            },
            {
              prompt: 'What is your key differentiator?',
              options: [
                'Focus on civic safety (lights, manholes, dumping) — not surveillance',
                'Works with existing sodium-vapor poles before LED upgrades',
                'Tamil alerts to ward electricians when clusters of lights fail',
                'Open ward map so parents can check school-route lighting status',
              ],
            },
          ),
        },
      ],
    },
  ],
}
