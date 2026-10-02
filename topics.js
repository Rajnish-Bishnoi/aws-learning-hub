/*
========================================================
AWS LEARNING HUB - TOPIC CONTENT
========================================================
EDITING RULE:
- Add/edit topic content ONLY in this file.
- Keep the same fields for every topic.
- Do not change index.html or style.css for normal notes.
========================================================
*/

const topics = [

{
  id: "ami",
  number: "1",
  title: "AMI",
  concept: "An AMI (Amazon Machine Image) is a template used to launch EC2 instances. It can contain the operating system, installed software, configuration and the root-volume state needed for launching another instance.",
  simple: "AMI ko EC2 ka ready-made blueprint samjho. Agar EC2-1 mein Docker install aur configuration kar di, to us EC2 ki AMI bana kar same setup wala EC2-2 launch kar sakte ho.",
  company: "A company has a standard web-server configuration. Instead of installing the same packages manually on every new server, the team creates a custom AMI and launches new EC2 instances from it.",
  practical: [
    "EC2-1 create kiya aur Docker install kiya.",
    "EC2-1 ki AMI create ki.",
    "AMI se EC2-2 launch kiya.",
    "EC2-2 mein Docker check kiya aur setup verify kiya."
  ],
  commands: [
    "docker --version",
    "sudo systemctl status docker"
  ],
  steps: [
    "Launch EC2-1.",
    "Install and configure required software.",
    "Stop services if your backup procedure requires it.",
    "Create AMI from EC2-1.",
    "Launch EC2-2 from the AMI.",
    "Verify OS, software and configuration on EC2-2."
  ],
  mistakes: [
    "AMI ko Snapshot ke same cheez samajhna.",
    "Wrong Region mein AMI search karna.",
    "AMI create karne se pehle important application/data state ko consider na karna.",
    "Production server ki AMI ko test kiye bina use karna."
  ],
  interview: [
    "What is an AMI?",
    "AMI aur EBS Snapshot mein difference kya hai?",
    "Custom AMI kyun banate hain?",
    "AMI ko another Region mein kaise copy karte hain?",
    "AMI se new EC2 launch karne par kya benefit milta hai?"
  ],
  notes: [
    "My practical: EC2-1 → Docker → AMI → EC2-2 → Docker verify.",
    "AMI is mainly useful for repeatable EC2 deployments."
  ]
},

{
  id: "ebs",
  number: "2",
  title: "EBS Volume",
  concept: "EBS (Elastic Block Store) provides persistent block storage for EC2 instances.",
  simple: "EC2 ko computer samjho aur EBS ko uska extra hard disk. Volume ko EC2 se attach karke filesystem bana sakte ho aur kisi directory par mount kar sakte ho.",
  company: "An application server needs a separate data disk so application data can remain independent from the root disk. The company attaches an EBS volume and mounts it at a dedicated path such as /data.",
  practical: [
    "Volume-1 create kiya.",
    "Volume-1 ko EC2-1 ke saath attach kiya.",
    "Volume ko filesystem ke liye prepare kiya.",
    "/mnt/data ko mount point banaya.",
    "Volume ko /mnt/data par mount kiya.",
    "Important file aur directory mount point ke andar create ki."
  ],
  commands: [
    "lsblk",
    "sudo file -s /dev/nvme1n1",
    "sudo mkfs -t ext4 /dev/nvme1n1",
    "sudo mkdir -p /mnt/data",
    "sudo mount /dev/nvme1n1 /mnt/data",
    "df -h",
    "sudo umount /mnt/data"
  ],
  steps: [
    "Create EBS volume in the same Availability Zone as the EC2 instance.",
    "Attach the volume to EC2.",
    "Use lsblk to identify the device.",
    "Check whether the volume already contains a filesystem.",
    "For a brand-new empty volume, create a filesystem.",
    "Create a mount point.",
    "Mount the volume.",
    "Store data inside the mount point.",
    "For persistent mounting, configure /etc/fstab carefully."
  ],
  mistakes: [
    "Existing data wale volume par mkfs chalana.",
    "Wrong device ko format kar dena.",
    "Unmount kiye bina filesystem operation karna.",
    "Mount point ke bahar data store karke sochna ki wo EBS volume par save hua hai.",
    "fstab mein unstable device name use karna; UUID is generally safer."
  ],
  interview: [
    "What is EBS?",
    "EBS volume ko EC2 se attach karne ki conditions kya hain?",
    "Mount point kya hota hai?",
    "EBS volume aur instance store mein difference?",
    "fstab ka use kyun hota hai?"
  ],
  notes: [
    "New volume ke data ko mount point ke andar store karna hai.",
    "Example: /mnt/data/impfile"
  ]
},

{
  id: "snapshot",
  number: "3",
  title: "Snapshot",
  concept: "An EBS Snapshot is a point-in-time backup of an EBS volume that can be used to create another volume.",
  simple: "Snapshot ko EBS volume ka backup/photo samjho. Baad mein isi snapshot se new EBS volume bana sakte ho.",
  company: "Before a risky database or application change, a team may create an EBS snapshot so the volume can be restored or duplicated if required.",
  practical: [
    "Volume-1 par important file aur directory create ki.",
    "Volume-1 ka snapshot create kiya.",
    "Snapshot se Volume-2 create kiya.",
    "Volume-2 ko EC2-2 se attach kiya.",
    "Volume-2 ko mount karke original data verify kiya."
  ],
  commands: [
    "lsblk",
    "sudo file -s /dev/nvme2n1",
    "sudo file -s /dev/nvme2n1p1",
    "df -h",
    "mount"
  ],
  steps: [
    "Create or select the source EBS volume.",
    "Create an EBS snapshot.",
    "Wait until the snapshot is ready.",
    "Create a new EBS volume from the snapshot.",
    "Attach the new volume to an EC2 instance.",
    "Identify the correct device.",
    "Mount it without formatting an existing filesystem.",
    "Verify the expected data."
  ],
  mistakes: [
    "Snapshot ko EC2 backup samajhna without considering all attached volumes.",
    "Snapshot se banaye volume ko blindly mkfs kar dena.",
    "Parent disk aur partition ko confuse karna.",
    "Wrong Region mein snapshot search karna."
  ],
  interview: [
    "What is an EBS Snapshot?",
    "Snapshot aur AMI mein difference?",
    "Snapshot se EBS volume kaise create karte hain?",
    "Snapshot ko another Region mein copy kar sakte hain?",
    "Snapshot incremental ka kya meaning hai?"
  ],
  notes: [
    "Important: mount error aaye to pehle lsblk aur file -s se device/filesystem identify karo.",
    "Unknown volume par blindly mkfs mat chalana."
  ]
},

{
  id: "cross-region",
  number: "4",
  title: "Copy AMI & Snapshot to Another Region",
  concept: "AWS allows supported AMIs and EBS snapshots to be copied to another Region.",
  simple: "Agar source Region Mumbai hai aur same resource ka backup/setup Singapore mein chahiye, to AMI ya Snapshot ko destination Region mein copy kar sakte ho.",
  company: "A company maintains workloads in more than one AWS Region for disaster recovery. It can copy required AMIs and snapshots to the secondary Region.",
  practical: [
    "AMI copy karke destination Region mein locate ki.",
    "Snapshot copy karke destination Region mein locate ki.",
    "Copied AMI se EC2 launch kiya.",
    "Copied snapshot se volume create karke EC2 se attach aur mount kiya."
  ],
  commands: [
    "aws ec2 describe-images --region <region>",
    "aws ec2 describe-snapshots --region <region>"
  ],
  steps: [
    "Open the source Region.",
    "Select the AMI and choose Copy AMI.",
    "Select destination Region.",
    "Wait for the copied AMI.",
    "For data, select the EBS snapshot and choose Copy Snapshot.",
    "Open the destination Region.",
    "Create a volume from the copied snapshot.",
    "Attach and mount the volume."
  ],
  mistakes: [
    "Source aur destination Region confuse karna.",
    "Destination Region mein resource locate na kar pana.",
    "Cross-Region copy ke associated costs/permissions ko ignore karna."
  ],
  interview: [
    "How do you copy an AMI to another Region?",
    "How do you copy an EBS Snapshot to another Region?",
    "Why is cross-Region backup useful?",
    "Can an EBS volume itself be directly moved to another Region?"
  ],
  notes: [
    "Flow: AMI → Copy → Destination Region → Launch EC2.",
    "Flow: Snapshot → Copy → Destination Region → Volume → Attach → Mount."
  ]
},

{
  id: "instance-type",
  number: "5",
  title: "EC2 Instance Type",
  concept: "An EC2 instance type defines the compute resources and capabilities available to an instance, such as vCPU, memory and networking characteristics.",
  simple: "Instance type ko computer ka configuration samjho. Jaise laptop mein RAM aur CPU choose karte ho, waise AWS mein instance type choose karte ho.",
  company: "A small internal application may need a modest general-purpose instance, while a CPU-heavy workload may need a compute-optimized instance.",
  practical: [
    "Launch time par instance type select kiya.",
    "Workload ke requirement ke according CPU/memory configuration compare ki."
  ],
  commands: [
    "lscpu",
    "free -h",
    "df -h"
  ],
  steps: [
    "Understand workload requirements.",
    "Choose a suitable instance family.",
    "Select the required size.",
    "Launch and monitor performance.",
    "Resize or change type when requirements change."
  ],
  mistakes: [
    "Only vCPU dekhkar instance choose karna.",
    "Memory requirement ignore karna.",
    "Workload monitoring na karna."
  ],
  interview: [
    "What is an EC2 instance type?",
    "General purpose aur compute optimized mein difference?",
    "Instance type change kaise karte hain?",
    "vCPU aur memory selection important kyun hai?"
  ],
  notes: [
    "Instance type = EC2 compute configuration."
  ]
},

{
  id: "userdata",
  number: "6",
  title: "User Data",
  concept: "EC2 User Data is commonly used to run initialization commands/scripts when an instance launches.",
  simple: "User Data ko EC2 ka automatic first-time setup script samjho.",
  company: "When a web server is launched, User Data can install packages and perform initial configuration automatically instead of doing it manually through SSH.",
  practical: [
    "EC2 launch ke time User Data mein shell script diya.",
    "Script ne required package installation/configuration start ki."
  ],
  commands: [
    "#!/bin/bash",
    "yum install docker -y",
    "systemctl enable docker",
    "systemctl start docker"
  ],
  steps: [
    "Open EC2 launch configuration.",
    "Find Advanced details → User data.",
    "Paste the shell script.",
    "Launch the instance.",
    "Connect to the instance.",
    "Verify the installation and service status."
  ],
  mistakes: [
    "Shebang miss karna.",
    "Wrong package manager use karna.",
    "Script failure logs check na karna.",
    "Assume karna ki every command har OS par same hogi."
  ],
  interview: [
    "What is EC2 User Data?",
    "When does User Data run?",
    "Why do we use #!/bin/bash?",
    "User Data aur manual SSH installation mein difference?"
  ],
  notes: [
    "User Data is useful for repeatable first-boot configuration."
  ]
},

{
  id: "vpc",
  number: "7",
  title: "VPC",
  concept: "Amazon VPC is a logically isolated virtual network where AWS resources can communicate using controlled networking configuration.",
  simple: "VPC ko AWS ka private network samjho. Iske andar subnets, route tables, gateways aur security controls hote hain.",
  company: "A company can place public-facing load balancers in public subnets and application/database servers in private subnets inside a VPC.",
  practical: [
    "VPC create ki.",
    "Subnet, route table aur gateway concepts practice kiye.",
    "EC2 networking ko VPC ke context mein samjha."
  ],
  commands: [
    "ip addr",
    "ip route",
    "curl ifconfig.me"
  ],
  steps: [
    "Create VPC with CIDR.",
    "Create public/private subnets.",
    "Create route tables.",
    "Attach Internet Gateway where required.",
    "Configure routes.",
    "Launch resources in appropriate subnets.",
    "Apply Security Groups and network controls."
  ],
  mistakes: [
    "Overlapping CIDR ranges choose karna.",
    "Public subnet ko only name se public samajhna.",
    "Route table configuration ignore karna.",
    "Security Group ko route table ka replacement samajhna."
  ],
  interview: [
    "What is a VPC?",
    "Public vs private subnet?",
    "What is an Internet Gateway?",
    "What is a route table?",
    "Security Group vs NACL?"
  ],
  notes: [
    "VPC = AWS virtual network."
  ]
},

{
  id: "peering",
  number: "8",
  title: "VPC Peering",
  concept: "VPC Peering provides private connectivity between two VPCs using their private IP addressing, subject to routing and security configuration.",
  simple: "Do alag VPCs ke beech private connection banana ho to VPC Peering use kar sakte ho.",
  company: "VPC-1 may contain an application and VPC-2 may contain services that need private connectivity. Peering can connect them when CIDRs do not overlap and routes/security are configured.",
  practical: [
    "Two VPCs ko identify kiya.",
    "Peering connection concept practice kiya.",
    "Route tables mein required routes add karne ka flow samjha."
  ],
  commands: [
    "ip route",
    "ping <private-ip>",
    "curl http://<private-ip>"
  ],
  steps: [
    "Create/select two VPCs with non-overlapping CIDRs.",
    "Create VPC Peering Connection.",
    "Accept the peering request if required.",
    "Add routes in both VPC route tables.",
    "Allow required traffic in Security Groups/NACLs.",
    "Test connectivity using private IPs."
  ],
  mistakes: [
    "Overlapping CIDRs.",
    "Sirf peering create karke route table update na karna.",
    "Security Group rules miss karna.",
    "Wrong subnet route table edit karna."
  ],
  interview: [
    "What is VPC Peering?",
    "Why must VPC CIDRs generally not overlap for peering?",
    "Is VPC Peering transitive?",
    "VPC Peering vs Transit Gateway?"
  ],
  notes: [
    "Peering is useful for direct private connectivity between VPCs."
  ]
},

{
  id: "transit-gateway",
  number: "9",
  title: "Transit Gateway",
  concept: "AWS Transit Gateway acts as a central network hub that can connect multiple VPCs and supported networks.",
  simple: "Agar 2 VPC hain to peering simple ho sakti hai. Agar bahut saare VPCs hain, Transit Gateway central hub jaisa kaam karta hai.",
  company: "A large organization may have separate VPCs for development, testing, production and shared services. Transit Gateway can provide centralized connectivity and routing between them.",
  practical: [
    "Transit Gateway ko central network hub ke concept ke roop mein practice kiya.",
    "VPC attachments aur route propagation/configuration ka flow samjha."
  ],
  commands: [
    "ip route",
    "ping <private-ip>"
  ],
  steps: [
    "Create or use a Transit Gateway.",
    "Create Transit Gateway attachments for required VPCs.",
    "Configure Transit Gateway route tables.",
    "Add/propagate routes as required.",
    "Configure VPC subnet route tables.",
    "Configure Security Groups/NACLs.",
    "Test private connectivity."
  ],
  mistakes: [
    "VPC route tables configure na karna.",
    "Transit Gateway route table aur VPC route table ko confuse karna.",
    "Security rules ignore karna.",
    "Simple two-VPC use case mein architecture unnecessarily complex banana."
  ],
  interview: [
    "What is Transit Gateway?",
    "Transit Gateway vs VPC Peering?",
    "What is a Transit Gateway attachment?",
    "Why is Transit Gateway useful at scale?",
    "What is transitive connectivity?"
  ],
  notes: [
    "Transit Gateway = central networking hub for multiple networks/VPCs."
  ]
}

];
