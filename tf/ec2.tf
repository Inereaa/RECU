
resource "aws_instance" "mi_instancia" {
  ami                        = "ami-0866a3c8686eaeeba"
  instance_type              = "t2.micro"
  key_name                   = aws_key_pair.apache_server_ssh.key_name
  subnet_id                  = aws_subnet.mi_subred_publica.id
  vpc_security_group_ids     = [aws_security_group.sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash

    # Actualizo e instalo docker
    sudo apt-get update -y
    sudo apt-get install docker.io -y

    # Inicio Docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Clono el repositorio
    sudo apt-get install git -y
    sudo git clone https://github.com/Inereaa/ptSVneikap.git /var/www/html

    # Construyo la imagen de Docker
    cd /var/www/html
    sudo docker build -t apache-server .
    # AQUÍ si fuese NGINX, solo cambio 'apache-server' por 'nginx-server'

    # Ejecuto el contenedor y le pongo un nombre
    # CAMBIADO PUERTO DE PETICIONES POR DEFECTO
    sudo docker run -d -p 8080:8080 -p 443:443 --name neikap apache-server
    # AQUÍ si fuese NGINX, solo cambio 'apache-server' por 'nginx-server'

  EOF

  tags = {
    Name = "MiInstanciaEC2"
  }
}
